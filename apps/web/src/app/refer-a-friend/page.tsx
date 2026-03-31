"use client";

import { useState } from "react";

export default function ReferAFriendPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-[2rem] lg:text-[2.5rem] font-semibold text-primary leading-tight mb-4 uppercase">
                Refer A Friend
              </h1>
              <p className="font-[family-name:var(--font-poppins)] text-navy text-[15px] leading-relaxed mb-3">
                Your friends deserve laundry that smells like winning.
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-navy text-[15px] leading-relaxed">
                Invite them to try We Deliver Laundry. They&apos;ll get{" "}
                <strong>$20 off</strong>, and so will you.
              </p>

              <h2 className="text-[1.5rem] font-semibold text-primary mt-10 mb-6">
                How it works:
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <h2 className="text-[2rem] font-bold text-primary leading-none">1</h2>
                  <p className="font-[family-name:var(--font-poppins)] text-navy text-[15px] pt-1">
                    <strong>Get your referral link.</strong> Just enter your email.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <h2 className="text-[2rem] font-bold text-primary leading-none">2</h2>
                  <p className="font-[family-name:var(--font-poppins)] text-navy text-[15px] pt-1">
                    <strong>Share it</strong> with your crew.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <h2 className="text-[2rem] font-bold text-primary leading-none">3</h2>
                  <p className="font-[family-name:var(--font-poppins)] text-navy text-[15px] pt-1">
                    <strong>Everyone saves $20</strong> and smells amazing.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[440px] h-[400px] shrink-0 bg-white/40 rounded-2xl" />
          </div>
        </div>
      </section>
    </>
  );
}
