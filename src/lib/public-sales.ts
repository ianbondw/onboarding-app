function clean(value: string | undefined | null) {
  return (value || "").trim();
}

export type PlanActionKind = "trial" | "checkout" | "booking" | "contact";

export type PlanAction = {
  href: string;
  label: string;
  kind: PlanActionKind;
  external?: boolean;
};

const guidedLaunchPaymentUrl = clean(process.env.NEXT_PUBLIC_GUIDED_LAUNCH_PAYMENT_URL);
const growthTeamPaymentUrl = clean(process.env.NEXT_PUBLIC_GROWTH_TEAM_PAYMENT_URL);
const bookingUrl = clean(process.env.NEXT_PUBLIC_BOOKING_URL);

export function buildTrialHref(planSlug: string) {
  return `/pilot?plan=${encodeURIComponent(planSlug)}`;
}

export function getPlanAction(planSlug: string): PlanAction {
  if (planSlug === "guided-launch") {
    if (guidedLaunchPaymentUrl) {
      return {
        href: guidedLaunchPaymentUrl,
        label: "Buy Guided Launch",
        kind: "checkout",
        external: true,
      };
    }
    return {
      href: buildTrialHref(planSlug),
      label: "Start instant trial",
      kind: "trial",
    };
  }

  if (planSlug === "growth-team") {
    if (growthTeamPaymentUrl) {
      return {
        href: growthTeamPaymentUrl,
        label: "Buy Growth Team",
        kind: "checkout",
        external: true,
      };
    }
    return {
      href: buildTrialHref(planSlug),
      label: "Start team trial",
      kind: "trial",
    };
  }

  if (bookingUrl) {
    return {
      href: bookingUrl,
      label: "Book rollout call",
      kind: "booking",
      external: true,
    };
  }

  return {
    href: "/contact",
    label: "Talk to us",
    kind: "contact",
  };
}

export function getBookingAction(fallbackHref: string): PlanAction {
  if (bookingUrl) {
    return {
      href: bookingUrl,
      label: "Book rollout call",
      kind: "booking",
      external: true,
    };
  }

  return {
    href: fallbackHref,
    label: "Talk to sales",
    kind: "contact",
    external: /^mailto:/i.test(fallbackHref),
  };
}
