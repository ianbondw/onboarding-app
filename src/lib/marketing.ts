export type PricingPlan = {
  slug: string;
  name: string;
  setupFee: string;
  monthlyPrice: string;
  bestFor: string;
  summary: string;
  highlights: string[];
  ctaHref: string;
  ctaLabel: string;
  featured?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "guided-launch",
    name: "Guided Launch",
    setupFee: "$750 setup",
    monthlyPrice: "$149/mo",
    bestFor: "Solo advisors and small RIAs that want a branded rollout fast.",
    summary:
      "We stand up your workspace, branding, advisor access, and guided launch flow in days instead of weeks.",
    highlights: [
      "1 branded workspace",
      "Up to 3 advisor logins",
      "Guided kickoff and launch checklist",
      "Lead capture, onboarding, and exports",
    ],
    ctaHref: "/pilot?plan=guided-launch",
    ctaLabel: "Start instant trial",
    featured: true,
  },
  {
    slug: "growth-team",
    name: "Growth Team",
    setupFee: "$2,000 setup",
    monthlyPrice: "$399/mo",
    bestFor: "RIA teams that need shared ops visibility, better follow-up, and cleaner reporting.",
    summary:
      "Adds stronger workflow for multiple advisors, team review, and a tighter handoff from prospect to funded household.",
    highlights: [
      "Up to 10 advisor logins",
      "Shared review queue and flags",
      "Trial analytics and lifecycle events",
      "PII minimization and audit trail controls",
      "Priority launch support",
    ],
    ctaHref: "/pilot?plan=growth-team",
    ctaLabel: "Start team trial",
  },
  {
    slug: "white-label-ops",
    name: "White-Label Ops",
    setupFee: "Custom setup",
    monthlyPrice: "Custom monthly",
    bestFor: "Firms that want custom domains, integrations, and a more embedded client onboarding stack.",
    summary:
      "Best fit when onboarding needs to plug into your CRM, compliance review, and downstream operations.",
    highlights: [
      "Custom domain and white-label polish",
      "CRM and webhook integration support",
      "Compliance workflow tailoring",
      "Implementation planning with your team",
    ],
    ctaHref: "/contact",
    ctaLabel: "Talk to us",
  },
];

export const revenueOutcomes = [
  {
    title: "Shorter time to first meeting",
    body:
      "Give prospects a clean intake link right after outreach so advisors spend less time chasing paperwork and more time moving toward funded accounts.",
  },
  {
    title: "Cleaner advisor follow-up",
    body:
      "Keep onboarding, flags, and review notes in one place so the next touchpoint is informed instead of improvised.",
  },
  {
    title: "A sellable operational story",
    body:
      "Show firms a branded workflow, advisor dashboard, and export path instead of a fragile demo or a spreadsheet-heavy back office.",
  },
];

export const rolloutSteps = [
  {
    title: "Create an instant trial",
    body:
      "Create a dedicated workspace with client onboarding, advisor access, and a review path instead of waiting for a shared fake demo.",
  },
  {
    title: "Run your actual intake flow",
    body:
      "Use the live onboarding link on desktop or mobile, complete a submission, and review it in the advisor dashboard.",
  },
  {
    title: "Decide your rollout package",
    body:
      "Use the trial to scope branding, advisor seats, exports, and integrations so the paid rollout is clear and specific.",
  },
  {
    title: "Launch your branded workspace",
    body:
      "Move from trial to live with your chosen package, production credentials, and the operational pieces your team needs.",
  },
];

export const faqItems = [
  {
    question: "How quickly can we launch?",
    answer:
      "Most guided trials can be provisioned immediately. Paid rollout timing depends on your branding and workflow needs, but the product is built for fast setup, not a long enterprise implementation.",
  },
  {
    question: "Do you support white-label and advisor-specific links?",
    answer:
      "Yes. Each advisor can have a scoped workspace and onboarding link, and the higher-touch rollout path supports deeper branding and operational polish.",
  },
  {
    question: "Can compliance or ops review submissions before they move forward?",
    answer:
      "Yes. The live product includes admin review, client field flags, compliance review states, minimized submission snapshots, and export options so operations can stay in control.",
  },
  {
    question: "How do you handle security and diligence?",
    answer:
      "The product includes encrypted sensitive fields, scoped portal sessions, audit logs, and a dedicated security page for diligence. Formal customer compliance and any SOC examination still depend on contracts, policies, and the broader control environment, not just the UI.",
  },
  {
    question: "Do we need to pay before trying it?",
    answer:
      "No. The guided trial is the fastest way to see the flow. Paid plans start when you want a branded rollout and implementation support.",
  },
  {
    question: "Can we start without a sales call?",
    answer:
      "Yes. The site now supports a self-serve path: watch the walkthrough, create a dedicated workspace, sign in with email plus MFA, and run a real sample submission without waiting for a live demo.",
  },
];

export const teamSizeOptions = [
  { value: "solo", label: "Solo advisor" },
  { value: "2-5", label: "2-5 advisors" },
  { value: "6-10", label: "6-10 advisors" },
  { value: "11+", label: "11+ advisors" },
];

export const timelineOptions = [
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "this-quarter", label: "This quarter" },
  { value: "researching", label: "Just researching" },
];

export function getPricingPlan(slug: string | null | undefined) {
  const normalized = (slug || "").trim().toLowerCase();
  return pricingPlans.find((plan) => plan.slug === normalized) || null;
}
