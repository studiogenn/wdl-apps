"use client";

import Script from "next/script";

export function ContactForm() {
  return (
    <>
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/3DYdzCZgqgeKevUP2y5s"
        style={{ width: "100%", height: "100%", border: "none", borderRadius: "24px" }}
        id="inline-3DYdzCZgqgeKevUP2y5s"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="General - Commercial Inquiry"
        data-height="575"
        data-layout-iframe-id="inline-3DYdzCZgqgeKevUP2y5s"
        data-form-id="3DYdzCZgqgeKevUP2y5s"
        title="General - Commercial Inquiry"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </>
  );
}
