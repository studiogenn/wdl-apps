"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import { questions, getSuggestion, type QuizAnswers, type Suggestion } from "./pricing-data";

function PageHeroSmall({ title, subtitle, onBack }: { title: string; subtitle: string; onBack?: () => void }) {
  return (
    <div className="relative overflow-hidden bg-primary px-5 pb-9 pt-7 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
          <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="20" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-7 z-20 flex items-center gap-1 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      )}
      <div className="relative z-10">
        <h2 className="text-2xl font-normal uppercase tracking-[1.5px] text-white">{title}</h2>
        <p className="mt-1.5 text-[13px] text-white/65">{subtitle}</p>
      </div>
    </div>
  );
}

export interface QuizFlowResult {
  suggestion: Suggestion;
  answers: QuizAnswers;
  zip: string;
  routeID: number;
}

interface QuizFlowProps {
  onComplete: (result: QuizFlowResult) => void;
  onBack: () => void;
}

export function QuizFlow({ onComplete, onBack }: QuizFlowProps) {
  const [zip, setZip] = useState("");
  const [zipStatus, setZipStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [routeID, setRouteID] = useState<number | null>(null);
  const [zipConfirmed, setZipConfirmed] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const totalSteps = questions.length + 1;
  const currentStep = zipConfirmed ? currentQ + 1 : 0;
  const q = questions[currentQ];

  const checkZip = useCallback(async (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length !== 5) return;
    setZipStatus("checking");
    try {
      const res = await fetch("/api/cleancloud/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: clean }),
      });
      const data = await res.json();
      if (data.success) {
        setZipStatus("valid");
        setRouteID(data.data.routeID);
      } else {
        setZipStatus("invalid");
        setRouteID(null);
      }
    } catch {
      setZipStatus("invalid");
      setRouteID(null);
    }
  }, []);

  const handleZipContinue = useCallback(() => {
    setZipConfirmed(true);
  }, []);

  const handleBack = useCallback(() => {
    if (!zipConfirmed) {
      onBack();
    } else if (currentQ === 0) {
      setZipConfirmed(false);
    } else {
      const prevQ = questions[currentQ - 1];
      const next = { ...answers };
      delete next[prevQ.id];
      setAnswers(next);
      setCurrentQ((prev) => prev - 1);
    }
  }, [zipConfirmed, currentQ, answers, onBack]);

  const handleAnswer = useCallback(
    (qId: string, val: string) => {
      const next = { ...answers, [qId]: val };
      setAnswers(next);

      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        onComplete({
          suggestion: getSuggestion(next),
          answers: next,
          zip,
          routeID: routeID!,
        });
      }
    },
    [answers, currentQ, onComplete, address, routeID],
  );

  return (
    <div className="min-h-screen bg-cream">
      <PageHeroSmall title="Let's find your plan" subtitle="A few quick questions — takes 30 seconds" onBack={handleBack} />

      <div className="mx-auto max-w-[500px] px-5 pb-20 pt-7">
        {/* Progress bar */}
        <div className="mb-7">
          <div className="mb-2 flex gap-[5px]">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                  i <= currentStep ? "bg-primary" : "bg-[#e8e5d0]"
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] uppercase tracking-[1.5px] text-[#6b7db3]">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>

        {!zipConfirmed ? (
          <>
            <h3 className="mb-6 text-[26px] font-normal uppercase leading-tight tracking-[1px] text-primary">
              Where do we pick up?
            </h3>

            <input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setZip(val);
                setZipStatus("idle");
                setRouteID(null);
                if (val.length === 5) checkZip(val);
              }}
              placeholder="Enter your ZIP code"
              className={cn(
                "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-[#0a1580] placeholder:text-[#b0b8cc] focus:outline-none focus:ring-2 focus:ring-primary/15",
                zipStatus === "valid" ? "border-green-400 focus:border-green-400" :
                zipStatus === "invalid" ? "border-red-400 focus:border-red-400" :
                "border-[#e8e5d0] focus:border-primary",
              )}
            />
            {zipStatus === "checking" && (
              <p className="mt-2 text-[12px] text-[#6b7db3]">Checking service area…</p>
            )}
            {zipStatus === "valid" && (
              <p className="mt-2 text-[12px] text-green-600">Great news — we serve your area!</p>
            )}
            {zipStatus === "invalid" && (
              <p className="mt-2 text-[12px] text-red-500">Sorry, we don&apos;t serve this zip code yet.</p>
            )}

            <button
              type="button"
              disabled={routeID === null}
              onClick={handleZipContinue}
              className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            {/* Question */}
            <h3 className="mb-6 text-[26px] font-normal uppercase leading-tight tracking-[1px] text-primary">
              {q.q}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(q.id, opt.value)}
                  className="group flex items-center gap-3 rounded-[14px] border-[1.5px] border-[#e8e5d0] bg-white px-[18px] py-4 text-left text-[15px] font-medium text-[#0a1580] transition-all hover:translate-x-1 hover:border-primary hover:bg-[#f0f3ff]"
                >
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-lg text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
