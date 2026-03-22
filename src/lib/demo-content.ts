export type DemoScene = {
  id: string;
  timestamp: string;
  startMs: number;
  durationMs: number;
  title: string;
  kicker: string;
  caption: string;
  highlights: string[];
};

export const demoScenes: DemoScene[] = [
  {
    id: "site",
    timestamp: "00:00",
    startMs: 0,
    durationMs: 7000,
    title: "Prospects land on a polished site, not a placeholder",
    kicker: "Scene 1",
    caption:
      "The public site now points people toward a clear path: watch the walkthrough, review trust and pricing, then create a dedicated trial without waiting for a live demo.",
    highlights: [
      "Modern homepage and pricing surface",
      "Tracked CTAs for demo and trial starts",
      "Trust center and legal packet linked from the main shell",
    ],
  },
  {
    id: "onboarding",
    timestamp: "00:07",
    startMs: 7000,
    durationMs: 7000,
    title: "Clients move through a guided onboarding flow",
    kicker: "Scene 2",
    caption:
      "The client experience is mobile-friendly, structured, and cleaner than email attachments or PDF packets, with progress, consent, and field guidance built in.",
    highlights: [
      "Guided mobile and desktop intake",
      "Progress tracking and section completion",
      "Sensitive fields minimized and handled more carefully",
    ],
  },
  {
    id: "dashboard",
    timestamp: "00:14",
    startMs: 14000,
    durationMs: 7000,
    title: "Advisors review submissions in a real workspace",
    kicker: "Scene 3",
    caption:
      "Once a submission lands, the advisor dashboard shows progress, status, follow-up context, and exports instead of burying the handoff in an inbox.",
    highlights: [
      "Scoped advisor portal access",
      "Client list, brief view, and exports",
      "Review states and operational follow-up",
    ],
  },
  {
    id: "privacy",
    timestamp: "00:21",
    startMs: 21000,
    durationMs: 7000,
    title: "Backoffice can manage privacy and retention workflows",
    kicker: "Scene 4",
    caption:
      "The new privacy queue handles data access, deletion, correction, legal hold, and retention review workflows, and approved deletions push records into redaction instead of ad hoc edits.",
    highlights: [
      "Public privacy-request intake form",
      "Internal queue for legal hold and deletion",
      "Retention states: active, legal_hold, deletion_pending, redacted",
    ],
  },
  {
    id: "trust",
    timestamp: "00:28",
    startMs: 28000,
    durationMs: 7000,
    title: "Trust and diligence questions have a real answer now",
    kicker: "Scene 5",
    caption:
      "The trust center packages the security overview, WISP summary, incident response summary, vendor list, recovery summary, SOC readiness page, and DPA and MSA baselines in one place.",
    highlights: [
      "Security packet in one public hub",
      "SOC readiness positioning without fake claims",
      "Legal pack ready for early diligence cycles",
    ],
  },
  {
    id: "trial",
    timestamp: "00:35",
    startMs: 35000,
    durationMs: 7000,
    title: "A buyer can start using Marengo immediately",
    kicker: "Scene 6",
    caption:
      "The self-serve trial flow provisions a dedicated workspace, returns the onboarding link, advisor dashboard, login, and temporary credentials, and now points the buyer to the walkthrough and trust docs.",
    highlights: [
      "Dedicated trial workspace on demand",
      "Email login plus MFA code at sign-in",
      "Clear next steps to use the app without a sales call",
    ],
  },
];

export const demoHowToUse = [
  {
    title: "Create a trial workspace",
    body:
      "Start from the instant trial form with only name and work email required. Marengo provisions a dedicated advisor workspace instead of dropping the buyer into a shared demo.",
  },
  {
    title: "Run one client submission",
    body:
      "Open the onboarding link on desktop or mobile and submit a realistic sample household so the advisor view has real workflow context.",
  },
  {
    title: "Sign into the advisor portal",
    body:
      "Use the emailed credentials, complete the email-code MFA step, and review the submission, status, and any follow-up flags in the dashboard.",
  },
  {
    title: "Share the trust packet internally",
    body:
      "If stakeholders ask about diligence, send the trust center instead of writing ad hoc explanations from scratch.",
  },
];

export const demoCoolFeatures = [
  "Instant dedicated workspaces instead of a generic demo account",
  "Advisor MFA, scoped sessions, and a real portal login flow",
  "Privacy queue with legal hold and deletion redaction support",
  "Trust center pages that help sales survive early diligence questions",
  "Tracked CTAs and a self-serve trial path designed for immediate conversion",
];

export const demoTranscript = demoScenes.map((scene) => ({
  timestamp: scene.timestamp,
  title: scene.title,
  caption: scene.caption,
}));

export const demoCaptionDownloadPath = "/demo/marengo-demo-captions.vtt";
