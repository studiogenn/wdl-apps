import { useState, useCallback } from "react";
import { questions, getSuggestion, type QuizAnswers, type Suggestion } from "./pricing-data";

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

interface QuizFlowProps {
  onComplete: (suggestion: Suggestion, answers: QuizAnswers) => void;
}

export function QuizFlow({ onComplete }: QuizFlowProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const q = questions[currentQ];

  const handleAnswer = useCallback(
    (qId: string, val: string) => {
      const next = { ...answers, [qId]: val };
      setAnswers(next);

      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        onComplete(getSuggestion(next), next);
      }
    },
    [answers, currentQ, onComplete],
  );

  return (
    <div className="min-h-screen bg-cream">
      <PageHeroSmall title="Let's find your plan" subtitle="A few quick questions — takes 30 seconds" />

      <div className="mx-auto max-w-[500px] px-5 pb-20 pt-7">
        {/* Progress bar */}
        <div className="mb-7">
          <div className="mb-2 flex gap-[5px]">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                  i <= currentQ ? "bg-primary" : "bg-[#e8e5d0]"
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] uppercase tracking-[1.5px] text-[#6b7db3]">
            Question {currentQ + 1} of {questions.length}
          </div>
        </div>

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
      </div>
    </div>
  );
}
