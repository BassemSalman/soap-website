"use client";

import { useState, useEffect, useRef } from "react";
import { HbtLogo } from "@/components/shared/logo";
import { IconClose, IconWhatsapp } from "@/components/shared/icons";

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function ChatBubbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="13" cy="12" r="1" fill="currentColor" />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--hbt-sage-deep)",
            display: "inline-block",
            animation: `hbt-dots 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
    </span>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "82%",
          padding: "10px 14px",
          background: isUser ? "var(--hbt-brown)" : "var(--hbt-sage-wash)",
          color: isUser ? "var(--hbt-cream-soft)" : "var(--hbt-ink)",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          fontSize: 14,
          lineHeight: 1.45,
          fontFamily: "var(--hbt-sans)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
};

// ── Main widget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi habibti — looking for something soft, or shopping for someone you love? I can help you pick.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // Clear unread indicator when opened
  useEffect(() => {
    if (open) setHasNew(false);
  }, [open]);

  const suggestions = [
    "What's good for dry skin?",
    "Gift for a new mum?",
    "How do I order?",
  ];

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);

    try {
      const conversationMessages = next.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationMessages }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      // Add a placeholder assistant message to stream into
      setMessages([...next, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value);
        setMessages([...next, { role: "assistant", content: assistantMessage }]);
      }
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Hmm, my line dropped. Try again — or chat with us directly on WhatsApp.",
        },
      ]);
    }

    setLoading(false);
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 88,
          right: 20,
          zIndex: 26,
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "var(--hbt-brown)",
          color: "var(--hbt-cream-soft)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 12px 28px -8px rgba(92,74,58,0.45), 0 4px 12px rgba(0,0,0,0.12)",
          transition: "transform .2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
        }}
      >
        {open ? <IconClose size={22} /> : <ChatBubbleIcon />}
        {!open && hasNew && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "var(--hbt-pink-deep)",
              border: "2px solid var(--hbt-brown)",
            }}
          />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 156,
            right: 20,
            zIndex: 26,
            width: "min(360px, calc(100vw - 40px))",
            maxHeight: "min(560px, calc(100vh - 200px))",
            background: "var(--hbt-paper)",
            borderRadius: 20,
            boxShadow:
              "0 24px 60px -20px rgba(92,74,58,0.35), 0 8px 24px rgba(0,0,0,0.08)",
            border: "1px solid var(--hbt-line-soft)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "hbt-chat-in .22s cubic-bezier(.2,.7,.3,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px 14px",
              background: "var(--hbt-cream-deep)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid var(--hbt-line-soft)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: "var(--hbt-paper)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid var(--hbt-brown)",
                flexShrink: 0,
              }}
            >
              <HbtLogo size={26} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--hbt-serif)",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                Ask habibti
                <span style={{ color: "var(--hbt-sage-deep)" }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--hbt-brown-soft)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--hbt-sage-deep)",
                    borderRadius: 999,
                  }}
                />
                We usually reply right away
              </div>
            </div>

            {/* WhatsApp escalation chip */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Switch to WhatsApp"
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px 5px 6px",
                borderRadius: 999,
                background: "rgba(37, 211, 102, 0.14)",
                color: "#1a8f48",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: "#25D366",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconWhatsapp size={11} />
              </span>
              WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 240,
            }}
          >
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <ChatBubble role="assistant" content={<TypingDots />} />
            )}

            {/* Suggestion chips — shown only at the start */}
            {messages.length <= 1 && !loading && (
              <div style={{ marginTop: 4 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--hbt-brown-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    margin: "8px 4px 6px",
                  }}
                >
                  Try asking
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 14,
                        border: "1px solid var(--hbt-line)",
                        background: "var(--hbt-cream-soft)",
                        color: "var(--hbt-ink)",
                        fontSize: 13,
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "var(--hbt-sans)",
                        transition: "background .12s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--hbt-cream-deep)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--hbt-cream-soft)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{
              padding: "10px 12px 12px",
              borderTop: "1px solid var(--hbt-line-soft)",
              display: "flex",
              gap: 6,
              alignItems: "flex-end",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={loading}
              style={{
                flex: 1,
                border: "1.5px solid var(--hbt-line)",
                borderRadius: 999,
                padding: "10px 14px",
                fontFamily: "var(--hbt-sans)",
                fontSize: 14,
                outline: "none",
                background: "var(--hbt-paper)",
                color: "var(--hbt-ink)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--hbt-sage-deep)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--hbt-line)";
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background:
                  input.trim() && !loading
                    ? "var(--hbt-brown)"
                    : "var(--hbt-cream-deep)",
                color:
                  input.trim() && !loading
                    ? "var(--hbt-cream-soft)"
                    : "var(--hbt-brown-soft)",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background .12s",
                flexShrink: 0,
              }}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
