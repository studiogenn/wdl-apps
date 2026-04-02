"use client";

import { useState, useCallback } from "react";
import {
  type PageView,
  type SubState,
  type PaygState,
  defaultSubState,
  defaultPaygState,
  PAYG_RATE,
  PAYG_RUSH_RATE,
  PAYG_FEE,
  PAYG_MIN,
  BEDDING_PRICE,
  DEEP_CLEAN_PAYG_ITEM_PRICE,
  careUpgrades,
  specialtyItems,
} from "./pricing-data";
import { HeroSection } from "./HeroSection";
import { QuizFlow, type QuizFlowResult } from "./QuizFlow";
import { SubscriptionBuilder } from "./SubscriptionBuilder";
import { PaygBuilder } from "./PaygBuilder";

export function PricingPage() {
  const [view, setView] = useState<PageView>("home");
  const [subState, setSubState] = useState<SubState>(defaultSubState);
  const [paygState, setPaygState] = useState<PaygState>(defaultPaygState);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const navigate = useCallback((page: PageView) => {
    setView(page);
    setCheckoutError(null);
    window.scrollTo(0, 0);
  }, []);

  const startQuiz = useCallback(() => {
    setView("quiz");
    window.scrollTo(0, 0);
  }, []);

  const handleQuizComplete = useCallback(
    (result: QuizFlowResult) => {
      const { suggestion, answers } = result;
      const selectedCare = answers.baby === "yes" || answers.pets === "yes" ? ["family"] : [];
      setSubState({
        ...defaultSubState,
        bags: suggestion.freq === "biweekly" && suggestion.bags < 2 ? 2 : suggestion.bags,
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

  const handleSubscriptionCheckout = useCallback(async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const planMetadata: Record<string, string> = {};
      if (subState.selectedCare.length > 0) planMetadata.care = subState.selectedCare.join(",");
      if (subState.addBedding) planMetadata.bedding = subState.beddingFreq;
      if (subState.isStudent) planMetadata.student = "true";

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "subscription",
          bags: subState.bags,
          frequency: subState.freq,
          successUrl: `${window.location.origin}/account?checkout=success`,
          cancelUrl: `${window.location.origin}/pricing`,
          planMetadata,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setCheckoutError(json.error ?? "Something went wrong");
        return;
      }
      window.location.href = json.data.url;
    } catch {
      setCheckoutError("Unable to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [subState]);

  const handlePaygCheckout = useCallback(async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const rate = paygState.rush ? PAYG_RUSH_RATE : PAYG_RATE;
      const laundryTotal = Math.max(PAYG_MIN, paygState.lbs * rate) + PAYG_FEE;
      const careTotal = paygState.selectedCare.reduce((s, id) => {
        const c = careUpgrades.find((x) => x.id === id);
        return s + (c ? c.price : 0);
      }, 0);
      const deepTotal = paygState.deepItems * DEEP_CLEAN_PAYG_ITEM_PRICE;
      const specTotal = Object.entries(paygState.specialtyQty).reduce((s, [name, qty]) => {
        const item = specialtyItems.find((i) => i.name === name);
        return s + (item ? item.price * qty : 0);
      }, 0);
      const beddingTotal = paygState.addBedding ? BEDDING_PRICE : 0;
      const orderTotal = laundryTotal + careTotal + deepTotal + specTotal + beddingTotal;
      const amountCents = Math.round(orderTotal * 100);

      const planMetadata: Record<string, string> = {
        estimatedLbs: String(paygState.lbs),
        rush: String(paygState.rush),
      };
      if (paygState.selectedCare.length > 0) planMetadata.care = paygState.selectedCare.join(",");
      if (paygState.addBedding) planMetadata.bedding = "true";
      if (paygState.deepItems > 0) planMetadata.deepCleanItems = String(paygState.deepItems);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "payment",
          amountCents,
          description: `One-time laundry order (~${paygState.lbs} lbs est.)`,
          successUrl: `${window.location.origin}/account?checkout=success`,
          cancelUrl: `${window.location.origin}/pricing`,
          planMetadata,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setCheckoutError(json.error ?? "Something went wrong");
        return;
      }
      window.location.href = json.data.url;
    } catch {
      setCheckoutError("Unable to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [paygState]);

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
      return (
        <SubscriptionBuilder
          state={subState}
          onChange={setSubState}
          onNavigate={navigate}
          onCheckout={handleSubscriptionCheckout}
          checkoutLoading={checkoutLoading}
          checkoutError={checkoutError}
        />
      );
    case "payg":
      return (
        <PaygBuilder
          state={paygState}
          onChange={setPaygState}
          onNavigate={navigate}
          onCheckout={handlePaygCheckout}
          checkoutLoading={checkoutLoading}
          checkoutError={checkoutError}
        />
      );
  }
}
