export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { provisionPortalUser } from "@/lib/admin-auth";
import { syncTrialLeadToHubSpot } from "@/lib/crm";
import { prisma } from "@/prisma";
import { issueAdvisorToken } from "@/lib/jwt";
import { sendMail } from "@/lib/mailer";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

function rand(len = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, len);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const leadName = (body?.name ?? "").toString().trim();
    const leadEmail = (body?.email ?? "").toString().trim().toLowerCase() || undefined;
    const leadFirm = (body?.firm ?? "").toString().trim() || undefined;
    const website = (body?.website ?? "").toString().trim() || undefined;
    const teamSize = (body?.teamSize ?? "").toString().trim() || undefined;
    const timeline = (body?.timeline ?? "").toString().trim() || undefined;
    const currentProcess = (body?.currentProcess ?? "").toString().trim() || undefined;
    const plan = (body?.plan ?? "").toString().trim() || undefined;
    const planName = (body?.planName ?? "").toString().trim() || undefined;
    const source = (body?.source ?? "website").toString().trim() || "website";

    const name = leadName || process.env.DEMO_ADVISOR_NAME || "Demo Advisor";
    const firm = leadFirm || process.env.DEMO_ADVISOR_FIRM || "Trial Workspace";

    if (leadEmail && !isValidEmail(leadEmail)) {
      return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
    }

    const baseSlug = slugify(`${name}-${firm}`) || "demo";
    let slug = `${baseSlug}-${rand(6)}`;
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${rand(6)}`;
    }

    const created = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.create({
        data: {
          slug,
          name,
          firm,
          email: leadEmail,
        },
        select: { id: true, name: true, firm: true, email: true },
      });

      const token = rand(24);
      await tx.intakeLink.create({
        data: {
          token,
          advisorId: advisor.id,
          isActive: true,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      });

      const lead =
        leadEmail && leadName
          ? await tx.trialLead.create({
              data: {
                name: leadName,
                email: leadEmail,
                firm: leadFirm,
                source,
                status: "new",
                advisorId: advisor.id,
                metadata: body ?? {},
              },
              select: { id: true },
            })
          : null;

      return { advisor, token, leadId: lead?.id ?? null };
    });

    const appOrigin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com").replace(/\/$/, "");
    const adminOrigin = (process.env.NEXT_PUBLIC_ADMIN_ORIGIN || appOrigin).replace(/\/$/, "");
    const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://marengofinance.com").replace(/\/$/, "");
    const adminToken = issueAdvisorToken(created.advisor.id);

    const onboardingUrl = `${appOrigin}/onboarding/${created.token}`;
    const adminUrl = `${adminOrigin}/admin/clients?admin_token=${adminToken}`;
    const loginUrl = `${adminOrigin}/admin/login`;
    const demoUrl = `${siteOrigin}/demo`;
    const trustUrl = `${siteOrigin}/trust`;
    const pricingUrl = `${siteOrigin}/pricing`;

    let portalUser:
      | { email: string; temporaryPassword: string }
      | null = null;
    if (leadEmail) {
      try {
        const provisioned = await provisionPortalUser({
          email: leadEmail,
          role: "advisor",
          advisorId: created.advisor.id,
        });
        portalUser = {
          email: provisioned.user.email,
          temporaryPassword: provisioned.temporaryPassword,
        };
      } catch (error) {
        console.warn("Trial portal user provisioning skipped:", error);
      }
    }

    if (created.leadId) {
      await prisma.trialLead.update({
        where: { id: created.leadId },
        data: {
          onboardingUrl,
          adminUrl,
        },
      });
    }

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: created.leadId ? "trial.requested" : "demo.link.generated",
        actorRole: "public",
        advisorId: created.advisor.id,
        leadId: created.leadId,
        metadata: {
          source,
          plan,
          planName,
          website,
          teamSize,
          timeline,
          currentProcess,
          hasLead: !!created.leadId,
          onboardingUrl,
          adminUrl,
          portalUserCreated: !!portalUser,
        },
      }),
      recordAuditLog({
        actorRole: "public",
        actorLabel: leadEmail || leadName || "anonymous_demo",
        advisorId: created.advisor.id,
        action: created.leadId ? "trial.requested" : "demo.link.generated",
        targetType: "advisor",
        targetId: created.advisor.id,
        metadata: {
          source,
          plan,
          planName,
          website,
          teamSize,
          timeline,
          hasLead: !!created.leadId,
          portalUserCreated: !!portalUser,
        },
      }),
      leadEmail
        ? syncTrialLeadToHubSpot({
            name: leadName,
            email: leadEmail,
            firm: leadFirm,
            website,
          })
        : Promise.resolve(),
    ]);

    const internalTo = process.env.DEMO_ALERT_TO || process.env.CONTACT_TO || "";
    if (internalTo && created.leadId) {
      await sendMail({
        to: internalTo,
        subject: `New Marengo trial request${planName ? ` - ${planName}` : ""}`,
        text: `Lead: ${leadName}
Email: ${leadEmail}
Firm: ${leadFirm || "(none)"}
Website: ${website || "(none)"}
Requested plan: ${planName || plan || "(none)"}
Advisor team size: ${teamSize || "(none)"}
Desired timeline: ${timeline || "(none)"}
Source: ${source}

Current onboarding process:
${currentProcess || "(not provided)"}

Onboarding URL:
${onboardingUrl}

Advisor URL:
${adminUrl}

Login URL:
${loginUrl}

Temporary password:
${portalUser?.temporaryPassword || "(not provisioned)"}

Walkthrough:
${demoUrl}

Trust center:
${trustUrl}

Pricing:
${pricingUrl}`,
      });
    }

    if (leadEmail && portalUser) {
      await sendMail({
        to: leadEmail,
        subject: "Your Marengo trial workspace is ready",
        text: `Your Marengo trial workspace is ready.

Name: ${leadName || created.advisor.name}
Firm: ${leadFirm || created.advisor.firm || "(none)"}
Requested rollout: ${planName || plan || "instant trial"}

Login URL: ${loginUrl}
Email: ${portalUser.email}
Temporary password: ${portalUser.temporaryPassword}

Onboarding URL: ${onboardingUrl}
Advisor dashboard: ${adminUrl}

How to start:
1. Watch the walkthrough: ${demoUrl}
2. Open the onboarding link and complete one sample submission.
3. Sign into the advisor portal. A one-time verification code will be sent to this same inbox.
4. Use the trust center during internal review: ${trustUrl}

Pricing and rollout options: ${pricingUrl}`,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        token: created.token,
        onboardingUrl,
        adminUrl,
        loginUrl,
        demoUrl,
        trustUrl,
        pricingUrl,
        portalUser,
        leadCaptured: !!created.leadId,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    console.error("POST /api/demo-token error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
