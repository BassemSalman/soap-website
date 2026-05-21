"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HbtWordmark } from "@/components/shared/logo";
import {
  IconUser,
  IconBag,
  IconMenu,
  IconClose,
  IconWhatsapp,
} from "@/components/shared/icons";

interface HeaderProps {
  cartCount?: number;
}

const iconBtnStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  border: "none",
  background: "transparent",
  color: "var(--hbt-ink)",
  cursor: "pointer",
};

const cartBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: 4,
  right: 4,
  background: "var(--hbt-pink-deep)",
  color: "white",
  fontSize: 10,
  fontWeight: 700,
  width: 16,
  height: 16,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid var(--hbt-cream-soft)",
};

const navLinks = [
  { href: "/products",       label: "Shop" },
  { href: "/basket-builder", label: "Gift someone" },
];

export function Header({ cartCount = 0 }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop header ── */}
      <header
        className="hidden md:block"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(250, 246, 240, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--hbt-line-soft)",
        }}
      >
        <div className="hbt-crochet-band" />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "14px 32px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: 32,
          }}
        >
          <Link href="/" style={{ background: "none", border: "none", padding: 0 }}>
            <HbtWordmark />
          </Link>

          <nav style={{ display: "flex", justifyContent: "center", gap: 36 }}>
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={i}
                  href={link.href}
                  style={{
                    fontFamily: "var(--hbt-sans)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive ? "var(--hbt-sage-deep)" : "var(--hbt-ink)",
                    padding: "6px 0",
                    borderBottom: isActive
                      ? "1.5px solid var(--hbt-sage-deep)"
                      : "1.5px solid transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px 7px 9px",
                borderRadius: 999,
                background: "rgba(37, 211, 102, 0.12)",
                color: "#1a8f48",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginRight: 4,
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: "#25D366",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconWhatsapp size={14} />
              </span>
              WhatsApp
            </a>

            <Link href="/account" style={iconBtnStyle}>
              <IconUser />
            </Link>

            <Link href="/cart" style={{ ...iconBtnStyle, position: "relative" }}>
              <IconBag />
              {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile header ── */}
      <header
        className="block md:hidden"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(250,246,240,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--hbt-line-soft)",
        }}
      >
        <div className="hbt-crochet-band" />
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={iconBtnStyle}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <Link href="/" style={{ background: "none", border: "none" }}>
            <HbtWordmark small />
          </Link>

          <div style={{ display: "flex", gap: 4 }}>
            <Link href="/account" style={iconBtnStyle}>
              <IconUser size={18} />
            </Link>
            <Link href="/cart" style={{ ...iconBtnStyle, position: "relative" }}>
              <IconBag size={18} />
              {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "var(--hbt-cream-soft)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <HbtWordmark />
            <button
              onClick={() => setDrawerOpen(false)}
              style={iconBtnStyle}
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                style={{
                  fontFamily: "var(--hbt-serif)",
                  fontSize: 32,
                  fontWeight: 500,
                  color: "var(--hbt-ink)",
                  padding: "10px 0",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>
      )}
    </>
  );
}
