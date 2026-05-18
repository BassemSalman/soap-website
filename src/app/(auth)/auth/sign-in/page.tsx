"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { HbtWordmark } from "@/components/shared/logo";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  async function handleGoogle() {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoadingEmail(true);
    await signIn("email", { email: email.trim(), callbackUrl: "/", redirect: false });
    setEmailSent(true);
    setLoadingEmail(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--hbt-cream-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--hbt-paper)",
          borderRadius: "var(--hbt-r-xl)",
          border: "1px solid var(--hbt-line-soft)",
          boxShadow: "var(--hbt-shadow-lg)",
          padding: "40px 36px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <HbtWordmark />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: 28,
            fontWeight: 500,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Welcome back,{" "}
          <em style={{ color: "var(--hbt-sage-deep)" }}>habibti</em>.
        </h1>
        <p
          style={{
            fontFamily: "var(--hbt-sans)",
            fontSize: 14,
            color: "var(--hbt-brown-soft)",
            textAlign: "center",
            margin: "8px 0 32px",
          }}
        >
          Sign in to your account
        </p>

        {emailSent ? (
          <div
            style={{
              width: "100%",
              padding: "20px 24px",
              borderRadius: "var(--hbt-r-lg)",
              background: "var(--hbt-sage-wash)",
              border: "1px solid var(--hbt-sage-soft)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 18,
                fontWeight: 500,
                color: "var(--hbt-sage-deep)",
                marginBottom: 6,
              }}
            >
              Check your inbox
            </div>
            <p
              style={{
                fontFamily: "var(--hbt-sans)",
                fontSize: 13,
                color: "var(--hbt-ink-soft)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={loadingGoogle}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "13px 20px",
                borderRadius: "var(--hbt-r-pill)",
                border: "none",
                background: "var(--hbt-sage-deep)",
                color: "var(--hbt-cream-soft)",
                fontFamily: "var(--hbt-sans)",
                fontSize: 14,
                fontWeight: 600,
                cursor: loadingGoogle ? "not-allowed" : "pointer",
                opacity: loadingGoogle ? 0.7 : 1,
                transition: "opacity .15s",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GoogleIcon />
              </span>
              {loadingGoogle ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "4px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--hbt-line-soft)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--hbt-sans)",
                  fontSize: 12,
                  color: "var(--hbt-brown-soft)",
                  whiteSpace: "nowrap",
                }}
              >
                or continue with email
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--hbt-line-soft)",
                }}
              />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 16px",
                  borderRadius: "var(--hbt-r-sm)",
                  border: "1.5px solid var(--hbt-line)",
                  fontFamily: "var(--hbt-sans)",
                  fontSize: 14,
                  outline: "none",
                  background: "var(--hbt-paper)",
                  color: "var(--hbt-ink)",
                  transition: "border-color .12s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--hbt-brown)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--hbt-line)";
                }}
              />
              <button
                type="submit"
                disabled={!email.trim() || loadingEmail}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "var(--hbt-r-pill)",
                  border: "none",
                  background: "var(--hbt-brown)",
                  color: "var(--hbt-cream-soft)",
                  fontFamily: "var(--hbt-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: !email.trim() || loadingEmail ? "not-allowed" : "pointer",
                  opacity: !email.trim() || loadingEmail ? 0.6 : 1,
                  transition: "opacity .15s",
                }}
              >
                {loadingEmail ? "Sending…" : "Send magic link"}
              </button>
            </form>

            {/* Guest note */}
            <p
              style={{
                fontFamily: "var(--hbt-sans)",
                fontSize: 12,
                color: "var(--hbt-brown-soft)",
                textAlign: "center",
                margin: "8px 0 0",
                lineHeight: 1.5,
              }}
            >
              You can browse freely — sign in is only required at checkout.
            </p>
          </div>
        )}

        {/* Footer note */}
        <p
          style={{
            fontFamily: "var(--hbt-sans)",
            fontSize: 11,
            color: "var(--hbt-brown-soft)",
            textAlign: "center",
            marginTop: 28,
            opacity: 0.8,
          }}
        >
          No passwords. Ever.
        </p>
      </div>
    </div>
  );
}
