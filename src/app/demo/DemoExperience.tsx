"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import TrackedLink from "@/components/TrackedLink";
import {
  demoCaptionDownloadPath,
  demoCoolFeatures,
  demoHowToUse,
  demoScenes,
  demoTranscript,
} from "@/lib/demo-content";
import { getBookingAction, getPlanAction } from "@/lib/public-sales";

function getActionEventName(kind: string) {
  if (kind === "checkout") return "Open Checkout CTA";
  if (kind === "booking") return "Book Call CTA";
  if (kind === "contact") return "Talk To Sales CTA";
  return "Start Trial CTA";
}

export default function DemoExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const completionTrackedRef = useRef(false);
  const guidedLaunchAction = getPlanAction("guided-launch");
  const bookingAction = getBookingAction("/contact");
  const currentScene = demoScenes[sceneIndex];
  const totalDuration = useMemo(
    () => demoScenes.reduce((sum, scene) => sum + scene.durationMs, 0),
    []
  );

  useEffect(() => {
    track("View Demo Page", {
      sceneCount: demoScenes.length,
      totalDurationSec: totalDuration / 1000,
    });
  }, [totalDuration]);

  useEffect(() => {
    track("View Demo Scene", {
      sceneId: currentScene.id,
      sceneNumber: sceneIndex + 1,
    });
  }, [currentScene.id, sceneIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = window.setTimeout(() => {
      setSceneIndex((current) => {
        if (current >= demoScenes.length - 1) {
          setIsPlaying(false);
          if (!completionTrackedRef.current) {
            completionTrackedRef.current = true;
            track("Complete Demo Walkthrough", { totalScenes: demoScenes.length });
          }
          return current;
        }
        return current + 1;
      });
    }, currentScene.durationMs);
    return () => window.clearTimeout(timeout);
  }, [currentScene.durationMs, currentScene.id, isPlaying]);

  function jumpTo(nextIndex: number) {
    const clamped = Math.max(0, Math.min(demoScenes.length - 1, nextIndex));
    setSceneIndex(clamped);
    completionTrackedRef.current = false;
    track("Jump Demo Scene", {
      sceneId: demoScenes[clamped].id,
      sceneNumber: clamped + 1,
    });
  }

  function togglePlayback() {
    setIsPlaying((current) => {
      const next = !current;
      track(next ? "Play Demo Walkthrough" : "Pause Demo Walkthrough", {
        sceneId: currentScene.id,
      });
      return next;
    });
  }

  function toggleCaptions() {
    setCaptionsEnabled((current) => {
      const next = !current;
      track(next ? "Enable Demo Captions" : "Disable Demo Captions", {
        sceneId: currentScene.id,
      });
      return next;
    });
  }

  return (
    <>
      <section className="grid gap-8 pt-4 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="eyebrow">Captioned product walkthrough</div>
          <div className="space-y-4">
            <h1 className="display-type max-w-5xl text-5xl font-semibold text-slate-950 md:text-7xl">
              A shareable demo that shows the product, the ops flow, and the trust story.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              This walkthrough is built for buyers and internal stakeholders. It highlights the
              client onboarding flow, advisor portal, privacy queue, trust center, and the instant
              trial experience with captions on by default.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "demo_page", placement: "hero" }}
              className="btn-primary px-5 py-3"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href={demoCaptionDownloadPath}
              eventName="Download Demo Captions"
              eventProps={{ source: "demo_page" }}
              className="btn-secondary px-5 py-3"
              external
              download
            >
              Download captions
            </TrackedLink>
            <TrackedLink
              href="/trust"
              eventName="Open Trust Center CTA"
              eventProps={{ source: "demo_page", placement: "hero" }}
              className="btn-plain px-4 py-3"
            >
              Open trust center
            </TrackedLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {demoCoolFeatures.map((item) => (
              <div key={item} className="surface-card p-5">
                <div className="relative z-10 text-sm leading-7 text-slate-700">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-card p-6 text-white">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              What this replaces
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "Shared demo links with no follow-through",
                "PDF-heavy intake that feels dated on arrival",
                "Diligence answers trapped in ad hoc email replies",
                "A sales process that depends on you being available live",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.3rem] border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Demo player
              </div>
              <h2 className="display-type mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">
                Follow the flow from first click to self-serve launch.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" type="button" onClick={togglePlayback}>
                {isPlaying ? "Pause walkthrough" : "Play walkthrough"}
              </button>
              <button className="btn-secondary" type="button" onClick={toggleCaptions}>
                {captionsEnabled ? "Hide captions" : "Show captions"}
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setIsPlaying(true);
                  jumpTo(0);
                  track("Restart Demo Walkthrough", {});
                }}
              >
                Restart
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 p-4 text-white shadow-[0_30px_80px_rgba(15,23,41,0.24)]">
              <div className="mb-4 flex gap-2">
                {demoScenes.map((scene, index) => {
                  const active = index === sceneIndex;
                  const completed = index < sceneIndex;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => jumpTo(index)}
                      className={`h-2 flex-1 rounded-full transition ${
                        active
                          ? "bg-amber-300"
                          : completed
                          ? "bg-emerald-300/80"
                          : "bg-white/12 hover:bg-white/24"
                      }`}
                      aria-label={`Jump to ${scene.title}`}
                    />
                  );
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/6 p-4">
                  <SceneVisual sceneId={currentScene.id} />
                </div>

                <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-white/7 p-5">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      {currentScene.kicker} | {currentScene.timestamp}
                    </div>
                    <h3 className="display-type mt-3 text-2xl font-semibold">
                      {currentScene.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentScene.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-[1.2rem] border border-white/10 bg-white/7 px-4 py-3 text-sm text-slate-100"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                      Why it matters
                    </div>
                    <p className="mt-3">{currentScene.caption}</p>
                  </div>
                </div>
              </div>

              {captionsEnabled ? (
                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-3 text-sm leading-7 text-slate-100">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Closed captions
                  </div>
                  <p className="mt-2">
                    [{currentScene.timestamp}] {currentScene.caption}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="surface-card p-6">
                <div className="relative z-10">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    How to use Marengo
                  </div>
                  <div className="mt-4 space-y-4">
                    {demoHowToUse.map((item, index) => (
                      <div
                        key={item.title}
                        className="rounded-[1.35rem] border border-slate-200/70 bg-white/70 p-4"
                      >
                        <div className="text-sm font-semibold text-amber-700">0{index + 1}</div>
                        <div className="mt-2 text-lg font-semibold text-slate-950">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <div className="relative z-10">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Next action
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    If the walkthrough looks good, the next best step is to create a dedicated
                    workspace and run one real submission. That proves the client flow, the advisor
                    dashboard, and the trust story in one shot.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <TrackedLink
                      href={guidedLaunchAction.href}
                      eventName={getActionEventName(guidedLaunchAction.kind)}
                      eventProps={{ source: "demo_page", placement: "side_panel" }}
                      className="btn-primary"
                      external={guidedLaunchAction.external}
                    >
                      {guidedLaunchAction.label}
                    </TrackedLink>
                    <TrackedLink
                      href="/pricing"
                      eventName="Open Pricing CTA"
                      eventProps={{ source: "demo_page", placement: "side_panel" }}
                      className="btn-secondary"
                    >
                      Review pricing
                    </TrackedLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.92fr,1.08fr]">
        <div className="surface-card p-6">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Transcript
            </div>
            <div className="mt-4 space-y-4">
              {demoTranscript.map((entry) => (
                <div
                  key={entry.timestamp}
                  className="rounded-[1.35rem] border border-slate-200/70 bg-white/70 p-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {entry.timestamp}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">
                    {entry.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{entry.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="spotlight-card p-8 text-white">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Self-serve conversion
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold md:text-4xl">
              Buyers can move from walkthrough to working workspace without waiting on you.
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                "Watch the walkthrough and understand the flow quickly",
                "Create a workspace from the instant-trial form",
                "Get onboarding and advisor links immediately",
                "Sign in with email plus MFA code",
                "Use the trust center during internal review",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.3rem] border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink
                href={guidedLaunchAction.href}
                eventName={getActionEventName(guidedLaunchAction.kind)}
                eventProps={{ source: "demo_page", placement: "bottom_cta" }}
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                external={guidedLaunchAction.external}
              >
                {guidedLaunchAction.label}
              </TrackedLink>
              <TrackedLink
                href={bookingAction.href}
                eventName={getActionEventName(bookingAction.kind)}
                eventProps={{ source: "demo_page", placement: "bottom_cta" }}
                className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
                external={bookingAction.external}
              >
                {bookingAction.label}
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SceneVisual({ sceneId }: { sceneId: string }) {
  if (sceneId === "onboarding") return <OnboardingScene />;
  if (sceneId === "dashboard") return <DashboardScene />;
  if (sceneId === "privacy") return <PrivacyScene />;
  if (sceneId === "trust") return <TrustScene />;
  if (sceneId === "trial") return <TrialScene />;
  return <SiteScene />;
}

function SiteScene() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3">
        <div className="text-sm font-semibold text-white">Marengo Finance</div>
        <div className="flex gap-2 text-xs text-slate-300">
          <span>Demo</span>
          <span>Pricing</span>
          <span>Trust</span>
        </div>
      </div>
      <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          RIA rollout-ready onboarding
        </div>
        <div className="mt-3 max-w-xl text-3xl font-semibold text-white">
          Client onboarding that feels modern enough to sell and strong enough to run.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
            Start instant trial
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
            Watch 2-minute demo
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
            Review trust center
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {["Polished site", "Tracked CTAs", "Self-serve trial"].map((item) => (
          <div
            key={item}
            className="rounded-[1.2rem] border border-white/10 bg-white/7 p-4 text-sm text-slate-100"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingScene() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.62fr,0.38fr]">
      <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-4">
        <div className="mx-auto max-w-[16rem] rounded-[2rem] border border-white/10 bg-white/6 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-3 h-5 w-16 rounded-full bg-white/10" />
          <div className="mb-4 h-2 rounded-full bg-white/10">
            <div className="h-2 w-3/5 rounded-full bg-amber-300" />
          </div>
          <div className="space-y-3">
            {["Client details", "Goals and risk", "Assets and liabilities", "Consent and review"].map((item) => (
              <div
                key={item}
                className="rounded-[1.1rem] border border-white/10 bg-white/7 px-3 py-3 text-xs text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <SceneMetric label="Progress" value="64%" />
        <SceneMetric label="Completion snapshot" value="4 sections" />
        <SceneMetric label="Submission state" value="In progress" />
      </div>
    </div>
  );
}

function DashboardScene() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SceneMetric label="Clients" value="24" />
        <SceneMetric label="Verified" value="11" />
        <SceneMetric label="Flags open" value="3" />
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
        <div className="grid grid-cols-[1.2fr,0.8fr,0.7fr,0.7fr] gap-3 border-b border-white/10 pb-3 text-xs uppercase tracking-[0.18em] text-slate-400">
          <div>Client</div>
          <div>Risk</div>
          <div>Status</div>
          <div>Progress</div>
        </div>
        <div className="mt-3 space-y-3">
          {[
            ["Jordan Lee", "Moderate", "verified", "100%"],
            ["Taylor Kim", "Growth", "in_progress", "72%"],
            ["Morgan Diaz", "Conservative", "review", "88%"],
          ].map((row) => (
            <div
              key={row[0]}
              className="grid grid-cols-[1.2fr,0.8fr,0.7fr,0.7fr] gap-3 rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-100"
            >
              <div>{row[0]}</div>
              <div>{row[1]}</div>
              <div className="capitalize">{row[2]}</div>
              <div>{row[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacyScene() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <SceneMetric label="Queue" value="9" />
        <SceneMetric label="Deletion" value="3" />
        <SceneMetric label="Legal hold" value="2" />
        <SceneMetric label="Open" value="6" />
      </div>
      <div className="space-y-3">
        {[
          ["Deletion request", "approved", "deletion_pending"],
          ["Retention review", "in_review", "active"],
          ["Legal hold", "on_hold", "legal_hold"],
        ].map((row) => (
          <div key={row[0]} className="rounded-[1.3rem] border border-white/10 bg-white/6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-white">{row[0]}</div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">{row[1]}</span>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100">
                  {row[2]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustScene() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[
        "Security overview",
        "WISP summary",
        "Incident response",
        "Vendor list",
        "Recovery summary",
        "DPA / MSA baselines",
      ].map((item) => (
        <div key={item} className="rounded-[1.35rem] border border-white/10 bg-white/7 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Trust Center
          </div>
          <div className="mt-2 text-sm font-semibold text-white">{item}</div>
        </div>
      ))}
    </div>
  );
}

function TrialScene() {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-400/10 p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
          Trial ready
        </div>
        <div className="mt-2 text-2xl font-semibold text-white">
          Dedicated workspace provisioned
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Client onboarding link",
            "Advisor dashboard link",
            "Portal login",
            "Temporary password",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.1rem] border border-white/10 bg-white/7 px-4 py-3 text-sm text-slate-100"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <SceneMetric label="Trial created" value="Instantly" />
        <SceneMetric label="MFA" value="Email code" />
        <SceneMetric label="Next step" value="Run one submission" />
      </div>
    </div>
  );
}

function SceneMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/7 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
