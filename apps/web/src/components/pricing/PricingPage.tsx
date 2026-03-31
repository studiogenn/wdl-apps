"use client";

import { useState, useCallback } from "react";
import {
  type PageView,
  type SubState,
  type PaygState,
  type QuizAnswers,
  type Suggestion,
  defaultSubState,
  defaultPaygState,
} from "./pricing-data";
import { HeroSection } from "./HeroSection";
import { QuizFlow } from "./QuizFlow";
import { SubscriptionBuilder } from "./SubscriptionBuilder";
import { PaygBuilder } from "./PaygBuilder";

export function PricingPage() {
  const [view, setView] = useState<PageView>("home");
  const [subState, setSubState] = useState<SubState>(defaultSubState);
  const [paygState, setPaygState] = useState<PaygState>(defaultPaygState);

  const navigate = useCallback((page: PageView) => {
    setView(page);
    window.scrollTo(0, 0);
  }, []);

  const startQuiz = useCallback(() => {
    setView("quiz");
    window.scrollTo(0, 0);
  }, []);

  const handleQuizComplete = useCallback(
    (suggestion: Suggestion, answers: QuizAnswers) => {
      const selectedCare = answers.baby === "yes" || answers.pets === "yes" ? ["family"] : [];
      setSubState({
        ...defaultSubState,
        bags: suggestion.bags,
        freq: suggestion.freq,
        isStudent: suggestion.student,
        selectedCare,
        suggestion,
        quizAnswers: answers,
      });
      navigate("subscription");
    },
    [navigate],
  );

  const handleShowSubscription = useCallback(() => {
    setSubState(defaultSubState);
    navigate("subscription");
  }, [navigate]);

  switch (view) {
    case "home":
      return (
        <HeroSection
          onNavigate={(page) => {
            if (page === "subscription") handleShowSubscription();
            else navigate(page);
          }}
          onStartQuiz={startQuiz}
        />
      );
    case "quiz":
      return <QuizFlow onComplete={handleQuizComplete} />;
    case "subscription":
      return <SubscriptionBuilder state={subState} onChange={setSubState} onNavigate={navigate} />;
    case "payg":
      return <PaygBuilder state={paygState} onChange={setPaygState} onNavigate={navigate} />;
  }
}
