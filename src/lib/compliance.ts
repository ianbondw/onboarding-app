import crypto from "crypto";

type ComplianceRequestInput = {
  advisorId: string;
  advisorName?: string | null;
  clientEmail: string;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  ssnLast4?: string | null;
  idDocType?: string | null;
};

function getProviderUrl() {
  return (process.env.KYC_PROVIDER_URL || process.env.COMPLIANCE_PROVIDER_URL || "").trim();
}

function signPayload(body: string) {
  const secret = (
    process.env.KYC_PROVIDER_SECRET || process.env.COMPLIANCE_PROVIDER_SECRET || ""
  ).trim();
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

export async function createComplianceRequest(input: ComplianceRequestInput) {
  const url = getProviderUrl();
  if (!url) return null;

  const body = JSON.stringify({
    advisorId: input.advisorId,
    advisorName: input.advisorName ?? null,
    client: {
      email: input.clientEmail,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      ssnLast4: input.ssnLast4 ?? null,
      idDocType: input.idDocType ?? null,
    },
  });

  try {
    const signature = signPayload(body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(signature ? { "x-marengo-signature": signature } : {}),
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Compliance provider request failed:", response.status);
      return null;
    }

    const json = await response.json().catch(() => ({}));
    const providerRef =
      (json?.providerRef ?? json?.id ?? json?.requestId ?? "").toString().trim() || null;
    const reviewUrl =
      (json?.reviewUrl ?? json?.verificationUrl ?? "").toString().trim() || null;

    return {
      providerRef,
      reviewUrl,
      raw: json,
    };
  } catch (error) {
    console.warn("Compliance provider request failed:", error);
    return null;
  }
}
