"use client";

import { IconWhatsapp } from "@/components/shared/icons";

export function WhatsappButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return (
    <a
      href={`https://wa.me/${number}`}
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: "#25D366",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 12px 28px -8px rgba(37, 211, 102, 0.5), 0 4px 12px rgba(0,0,0,0.12)",
        zIndex: 25,
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <IconWhatsapp size={28} />
    </a>
  );
}
