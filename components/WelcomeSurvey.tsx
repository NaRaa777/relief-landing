"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShareBlock } from "@/components/ShareBlock";
import { track } from "@/lib/client/analytics";
import {
  CURRENT_METHODS,
  PAIN_LEVELS,
  WOULD_PAY,
  type CurrentMethod,
  type SurveyAnswers,
} from "@/lib/waitlist";

const QUESTIONS = [
  { title: "How painful are your periods, usually?", options: PAIN_LEVELS, multi: false },
  { title: "What do you use today to get through it?", options: CURRENT_METHODS, multi: true },
  {
    title: "Would you pay for an app that helps you plan around your hard days?",
    options: WOULD_PAY,
    multi: false,
  },
] as const;

const STEP_COUNT = QUESTIONS.length;
const AUTO_ADVANCE_MS = 250;
const EMPTY: SurveyAnswers = { pain_level: null, current_methods: [], would_pay: null };

type Phase = "asking" | "saving" | "error" | "done";

function hasAnswers(a: SurveyAnswers) {
  return Boolean(a.pain_level || a.would_pay || a.current_methods.length);
}

export function WelcomeSurvey() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [answers, setAnswers] = useState<SurveyAnswers>(EMPTY);
  const [phase, setPhase] = useState<Phase>("asking");
  const [error, setError] = useState("");
  const [canRetry, setCanRetry] = useState(true);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const firstRender = useRef(true);
  const viewed = useRef(false);
  // Answers as of now, for the leave-the-page handler.
  const latest = useRef({ answers, phase, partialSent: false });
  useEffect(() => {
    latest.current.answers = answers;
    latest.current.phase = phase;
  }, [answers, phase]);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("welcome_viewed");
  }, []);

  // Partial save: if the visitor leaves mid-survey, keep what they answered.
  useEffect(() => {
    function onHide() {
      const s = latest.current;
      if (document.visibilityState !== "hidden" || s.partialSent) return;
      if (s.phase === "done" || s.phase === "saving" || !hasAnswers(s.answers)) return;
      s.partialSent = true;
      const body = JSON.stringify({ answers: s.answers, completed: false });
      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/survey", blob)) {
        void fetch("/api/survey", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    }
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Move focus to each new question so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step, phase]);

  async function finish(final: SurveyAnswers) {
    if (!hasAnswers(final)) {
      setPhase("done");
      return;
    }
    setPhase("saving");
    setError("");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: final, completed: true }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; code?: string; message?: string } | null;
      if (!res.ok || !data?.ok) {
        setCanRetry(data?.code !== "expired");
        setError(data?.message ?? "We couldn’t save your answers. Please try again.");
        setPhase("error");
        return;
      }
      track("survey_completed", {
        pain_level: final.pain_level ?? "",
        current_methods: final.current_methods,
        would_pay: final.would_pay ?? "",
      });
      setPhase("done");
    } catch {
      setCanRetry(true);
      setError("We couldn’t connect. Check your connection and try again.");
      setPhase("error");
    }
  }

  function goNext(next: SurveyAnswers) {
    clearTimeout(advanceTimer.current);
    advanceTimer.current = undefined;
    if (step === STEP_COUNT - 1) {
      void finish(next);
      return;
    }
    setDirection("next");
    setStep(step + 1);
  }

  function goBack() {
    if (step === 0) return;
    clearTimeout(advanceTimer.current);
    advanceTimer.current = undefined;
    setDirection("back");
    setStep(step - 1);
  }

  function selectSingle(value: string) {
    if (advanceTimer.current) return; // already advancing
    const next: SurveyAnswers =
      step === 0
        ? { ...answers, pain_level: value as SurveyAnswers["pain_level"] }
        : { ...answers, would_pay: value as SurveyAnswers["would_pay"] };
    setAnswers(next);
    track("survey_step_completed", { step: String(step + 1) });
    advanceTimer.current = setTimeout(() => goNext(next), AUTO_ADVANCE_MS);
  }

  function toggleMethod(value: CurrentMethod) {
    setAnswers((a) => ({
      ...a,
      current_methods: a.current_methods.includes(value)
        ? a.current_methods.filter((m) => m !== value)
        : [...a.current_methods, value],
    }));
  }

  function continueMulti() {
    track("survey_step_completed", { step: String(step + 1) });
    goNext(answers);
  }

  function skip() {
    track("survey_skipped", { step: String(step + 1) });
    const key = (["pain_level", "current_methods", "would_pay"] as const)[step];
    const next: SurveyAnswers = { ...answers, [key]: key === "current_methods" ? [] : null };
    setAnswers(next);
    goNext(next);
  }

  const done = phase === "done";
  const completedSteps = done ? STEP_COUNT : step;
  const question = QUESTIONS[step];

  return (
    <>
      {/* Step 0: confirmation, always visible */}
      <div>
        <h1 className="font-serif text-[1.6rem] leading-tight tracking-tight">You&rsquo;re on the list 💌</h1>
        {/* The intro line only on the first question, so every step fits a
            375×667 screen without scrolling. */}
        {step === 0 && !done && (
          <p className="mt-1 text-[15px] leading-snug text-cream/85">
            Three quick questions help us build Relief for you. Takes 15 seconds.
          </p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Survey progress"
            aria-valuemin={0}
            aria-valuemax={STEP_COUNT}
            aria-valuenow={completedSteps}
            aria-valuetext={done ? "Survey finished" : `Question ${step + 1} of ${STEP_COUNT}`}
            className="grid flex-1 grid-cols-3 gap-1.5"
          >
            {QUESTIONS.map((q, i) => (
              <span key={q.title} className="h-1 overflow-hidden rounded-full bg-white/15">
                <span
                  className={`block h-full rounded-full bg-blush transition-[width] duration-500 ease-out ${
                    i < completedSteps ? "w-full" : i === step && !done ? "w-1/3" : "w-0"
                  }`}
                />
              </span>
            ))}
          </div>
          <span aria-hidden="true" className="text-xs font-semibold tracking-wide text-cream/75 tabular-nums">
            {done ? "Done" : `${step + 1} of ${STEP_COUNT}`}
          </span>
        </div>
      </div>

      {done ? (
        <section
          key="done"
          aria-labelledby="welcome-step-title"
          // flex-1 + mt-auto pins the actions to the bottom of the screen; on
          // short screens the pt-6 gap keeps them below the text and the page
          // scrolls. The bottom padding tops main's max(0.75rem, safe area) up
          // to max(24px, safe area).
          className="animate-step-next mt-8 flex flex-1 flex-col pb-[calc(max(24px,env(safe-area-inset-bottom))-max(0.75rem,env(safe-area-inset-bottom)))]"
        >
          <h2
            id="welcome-step-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-[1.65rem] leading-tight outline-none"
          >
            Thank you &mdash; that genuinely helps.
          </h2>
          <p className="mt-2 text-base leading-relaxed text-cream/85">
            Know someone who dreads that time of the month? Send them Relief.
          </p>
          <div className="mt-auto flex flex-col pt-6">
            <ShareBlock tone="dark" className="w-full" />
            <Link
              href="/"
              className="mt-5 self-center rounded-md px-2 py-2 text-[15px] text-cream/85 underline underline-offset-4 hover:text-cream"
            >
              Back to Relief
            </Link>
          </div>
        </section>
      ) : (
        <section
          key={step}
          aria-labelledby="welcome-step-title"
          className={`${direction === "next" ? "animate-step-next" : "animate-step-back"} mt-4 flex flex-col`}
        >
          <h2
            id="welcome-step-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-[1.3rem] leading-snug outline-none"
          >
            {question.title}
          </h2>
          {question.multi && <p className="mt-0.5 text-[15px] text-cream/80">Pick all that apply</p>}

          <div role="group" aria-labelledby="welcome-step-title" className="mt-3 flex flex-col gap-3">
            {question.options.map(([value, label]) => {
              const selected = question.multi
                ? answers.current_methods.includes(value as CurrentMethod)
                : (step === 0 ? answers.pain_level : answers.would_pay) === value;
              return (
                <Option
                  key={value}
                  multi={question.multi}
                  selected={selected}
                  disabled={phase === "saving"}
                  onClick={() =>
                    question.multi ? toggleMethod(value as CurrentMethod) : selectSingle(value)
                  }
                >
                  {label}
                </Option>
              );
            })}
          </div>

          {phase === "saving" && (
            <p role="status" className="mt-4 flex items-center gap-2 text-[15px] text-cream/85">
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              Saving your answers&hellip;
            </p>
          )}

          {phase === "error" && (
            <div className="mt-4">
              <p role="alert" className="text-[15px] leading-snug font-medium text-[#ffc7ce]">
                {error}
              </p>
              <div className="mt-2 flex items-center gap-4">
                {canRetry ? (
                  <>
                    <button
                      type="button"
                      onClick={() => finish(answers)}
                      className="h-11 rounded-full bg-cream px-5 text-[15px] font-semibold text-plum hover:bg-blush"
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhase("done")}
                      className="h-11 px-1 text-[15px] text-cream/85 underline underline-offset-4"
                    >
                      Finish without saving
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPhase("done")}
                    className="h-11 rounded-full bg-cream px-5 text-[15px] font-semibold text-plum hover:bg-blush"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "asking" && (
            <div className="mt-3 flex min-h-11 items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="-ml-1 inline-flex h-11 items-center gap-1.5 rounded-full px-1 text-[15px] font-medium text-cream/90 hover:text-cream"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                    <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
              ) : (
                <span />
              )}

              {question.multi && answers.current_methods.length > 0 ? (
                <button
                  type="button"
                  onClick={continueMulti}
                  className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-cream px-6 text-base font-semibold text-plum transition-colors hover:bg-blush active:scale-[0.99] min-[380px]:max-w-[14rem]"
                >
                  Continue
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                    <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={skip}
                  className="h-11 rounded-full px-2 text-[15px] text-cream/75 underline underline-offset-4 hover:text-cream"
                >
                  Skip
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function Option({
  multi,
  selected,
  disabled,
  onClick,
  children,
}: {
  multi: boolean;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-full py-2.5 pr-3 pl-5 text-left text-[17px] font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream disabled:opacity-60 ${
        selected
          ? "bg-cream text-plum shadow-[0_10px_30px_-14px_rgb(10_2_6/0.8)]"
          : "bg-white/[0.07] text-cream ring-1 ring-white/35 ring-inset hover:bg-white/[0.13]"
      }`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
          selected ? "bg-burgundy text-cream" : multi ? "ring-[1.5px] ring-white/45 ring-inset" : ""
        }`}
      >
        {selected && (
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
