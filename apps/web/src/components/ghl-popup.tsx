"use client";

import { useEffect, useState } from "react";

export function GhlPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [show]);

  if (!show) return null;

  return (
    <iframe
      src="https://api.leadconnectorhq.com/widget/form/gWpclOO6t95CnIbR6p4I"
      style={{ display: "none", width: "100%", height: "100%", border: "none", borderRadius: 3 }}
      id="popup-gWpclOO6t95CnIbR6p4I"
      data-layout="{'id':'POPUP'}"
      data-trigger-type="alwaysShow"
      data-trigger-value=""
      data-activation-type="activateOnVisit"
      data-activation-value="1"
      data-deactivation-type="leadCollected"
      data-deactivation-value=""
      data-form-name="WELCOME15 POPUP"
      data-height="281"
      data-layout-iframe-id="popup-gWpclOO6t95CnIbR6p4I"
      data-form-id="gWpclOO6t95CnIbR6p4I"
      title="WELCOME15 POPUP"
    />
  );
}
