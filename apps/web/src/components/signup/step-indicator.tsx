"use client";

type StepIndicatorProps = {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly labels?: ReadonlyArray<string>;
};

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-navy/10 text-navy/40"
                  }`}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {labels?.[i] && (
                  <span className={`mt-1.5 text-[11px] font-medium font-[family-name:var(--font-poppins)] ${
                    isActive || isCompleted ? "text-navy" : "text-navy/40"
                  }`}>
                    {labels[i]}
                  </span>
                )}
              </div>
              {step < totalSteps && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                  isCompleted ? "bg-primary" : "bg-navy/10"
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-navy/50 font-[family-name:var(--font-poppins)]">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
