export const wispSections = [
  {
    title: "Program Scope",
    body: [
      "Marengo Finance maintains a written information security program summary for the website, advisor portal, onboarding workflows, and supporting service providers used to operate the product.",
      "The program is designed around role-based access, minimum-necessary collection, encryption of selected sensitive values, change management, vendor oversight, and incident response coordination.",
    ],
  },
  {
    title: "Administrative Controls",
    body: [
      "The operating model includes user provisioning and deprovisioning, audit logging, privacy workflow handling, password reset controls, and multi-factor authentication for password-based portal login.",
      "Control owners still need to document policies, perform periodic access reviews, and retain evidence if a formal examination or customer diligence process requires it.",
    ],
  },
  {
    title: "Technical Controls",
    body: [
      "The current product uses HTTPS, hardened cookies, role-scoped sessions, login throttling, audit trails, minimized intake snapshots, and encrypted storage for selected identity fields.",
      "Deletion workflows redact matching client and lead records after review instead of relying on ad hoc manual edits.",
    ],
  },
  {
    title: "Vendor Oversight",
    body: [
      "Managed infrastructure and service providers are reviewed as part of the stack design, and the trust center identifies the standard vendors used by default plus optional integrations that a customer may enable.",
    ],
  },
] as const;

export const incidentResponseSections = [
  {
    title: "Detection and Triage",
    body: [
      "Security issues may be identified through application errors, operational logs, customer reports, or downstream vendor notifications. Material events should be triaged promptly and escalated to the designated response owner.",
    ],
  },
  {
    title: "Containment and Recovery",
    body: [
      "The operating response path is to isolate affected access, revoke sessions if needed, preserve logs, scope potentially affected records, remediate root cause, and restore service through standard deployment or infrastructure recovery steps.",
    ],
  },
  {
    title: "Notifications",
    body: [
      "Customer, legal, and regulator notification obligations depend on the customer contract, the incident facts, and applicable law. This summary supports process readiness but does not replace legal advice or a customer-specific incident plan.",
    ],
  },
] as const;

export const vendorSections = [
  {
    title: "Standard Service Providers",
    body: [
      "Typical default vendors in the current stack include Vercel for hosting and deployment, managed PostgreSQL for data storage, Resend for transactional email, and Sentry for application monitoring when enabled.",
      "Optional integrations may include HubSpot for CRM sync and a configurable identity or compliance-review provider selected by the customer deployment.",
    ],
  },
  {
    title: "How To Use This List",
    body: [
      "Treat this as the standard deployment profile, not a blanket promise that every environment uses every listed vendor. Customer-specific contracts or enabled integrations can change the effective subprocessors.",
    ],
  },
] as const;

export const recoverySections = [
  {
    title: "Backups and Restore Strategy",
    body: [
      "The standard deployment assumes managed infrastructure with backup and restore features provided by the hosting and database vendors. Recovery depends on the environment configuration that is actually in place for the deployment.",
      "Operationally, the product is designed so the application can be redeployed from source control and infrastructure configuration while data recovery follows the managed database restore path.",
    ],
  },
  {
    title: "Recovery Objectives",
    body: [
      "Recovery objectives should be set contractually or internally by the customer based on operational needs. This public summary describes the expected recovery path but does not itself establish binding recovery SLAs.",
    ],
  },
] as const;

export const socReadinessSections = [
  {
    title: "Current Position",
    body: [
      "Marengo Finance is preparing for SOC 2 readiness and trust-center diligence, but this site does not claim an issued SOC 2 report.",
      "The product now has stronger technical controls in code, including MFA for password logins, audit logging, privacy workflow handling, retention redaction, and security documentation.",
    ],
  },
  {
    title: "What Remains Outside Code",
    body: [
      "SOC 2 readiness still requires documented policies, employee training, risk assessment, evidence collection, vendor review, change-management records, incident-response testing, and an auditor-led examination period.",
    ],
  },
  {
    title: "Recommended Readiness Track",
    body: [
      "The practical next steps are to finalize policy documents, define control owners, gather evidence in a repeatable place, perform quarterly access and vendor reviews, and engage an auditor only after the operating controls are stable enough to test.",
    ],
  },
] as const;

export const dpaSections = [
  {
    title: "Processor Scope",
    body: [
      "A DPA-ready baseline should define Marengo Finance as processor or service provider for customer-submitted personal data, limited to onboarding, workflow, support, security, and customer-authorized integrations.",
    ],
  },
  {
    title: "Security and Subprocessors",
    body: [
      "The template should include commitments around appropriate safeguards, subprocessor notice, breach escalation, deletion support, and return or deletion of customer data at the end of services, subject to legal retention needs.",
    ],
  },
  {
    title: "Cross-Border and Customer Addenda",
    body: [
      "Any final DPA still needs customer-specific terms for regional transfer mechanisms, privacy-law roles, and negotiated security attachments. This page is a starting point, not a substitute for negotiated legal language.",
    ],
  },
] as const;

export const msaSections = [
  {
    title: "Commercial Baseline",
    body: [
      "An MSA-ready baseline should cover subscription scope, implementation support, payment terms, acceptable use, confidentiality, security cooperation, service changes, and termination rights.",
    ],
  },
  {
    title: "Risk Allocation",
    body: [
      "The legal pack should also address warranty scope, disclaimers, limitation of liability, indemnity structure, data return or deletion assistance, audit or diligence handling, and regulator cooperation boundaries.",
    ],
  },
  {
    title: "Why It Is 'Ready' And Not Final",
    body: [
      "Customers often require their own paper or negotiated changes. The goal of this pack is to shorten review cycles by giving sales and counsel a tighter starting point, not to pretend a one-size-fits-all contract is final.",
    ],
  },
] as const;
