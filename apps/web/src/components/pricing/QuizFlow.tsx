import { useState, useCallback } from "react";
import { questions, getSuggestion, type QuizAnswers, type Suggestion } from "./pricing-data";
import { AddressInput } from "@/components/account/address-input";

function PageHeroSmall({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden bg-primary px-5 pb-9 pt-7 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
          <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="20" fill="none" strokeLinecap="round" />
        </svg>
      </div>
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
  address: string;
  routeID: number;
}

interface QuizFlowProps {
  onComplete: (result: QuizFlowResult) => void;
}

export function QuizFlow({ onComplete }: QuizFlowProps) {
  const [address, setAddress] = useState("");
  const [routeID, setRouteID] = useState<number | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const totalSteps = questions.length + 1; // address step + quiz questions
  const currentStep = addressConfirmed ? currentQ + 1 : 0;
  const q = questions[currentQ];

  const handleAddressValidated = useCallback((id: number) => {
    setRouteID(id);
  }, []);

  const handleAddressInvalid = useCallback(() => {
    setRouteID(null);
  }, []);

  const handleAddressContinue = useCallback(() => {
    setAddressConfirmed(true);
  }, []);

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
          address,
          routeID: routeID!,
        });
      }
    },
    [answers, currentQ, onComplete, address, routeID],
  );

  return (
    <div className="min-h-screen bg-cream">
      <PageHeroSmall title="Let's find your plan" subtitle="A few quick questions — takes 30 seconds" />

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

        {!addressConfirmed ? (
          <>
            <h3 className="mb-6 text-[26px] font-normal uppercase leading-tight tracking-[1px] text-primary">
              Where do we pick up?
            </h3>

            <AddressInput
              value={address}
              onChange={(addr) => {
                setAddress(addr);
                setRouteID(null);
              }}
              onValidated={handleAddressValidated}
              onInvalid={handleAddressInvalid}
            />

            <button
              type="button"
              disabled={routeID === null}
              onClick={handleAddressContinue}
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
