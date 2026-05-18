"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HbtLogo } from "@/components/shared/logo";
import {
  IconTrend,
  IconBox,
  IconLeaf,
  IconAlert,
  IconTag,
  IconMenu,
  IconClose,
} from "@/components/shared/icons";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <IconTrend size={16} /> },
  { href: "/admin/orders", label: "Orders", icon: <IconBox size={16} /> },
  { href: "/admin/products", label: "Products", icon: <IconLeaf size={16} /> },
  { href: "/admin/raw-materials", label: "Raw Materials", icon: <IconAlert size={16} /> },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: <IconTag size={16} /> },
  { href: "/admin/reports", label: "Reports", icon: <IconTrend size={16} /> },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "var(--hbt-paper)",
          borderBottom: "1px solid var(--hbt-line-soft)",
          padding: "12px 16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="admin-mobile-bar"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HbtLogo size={28} />
          <div>
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 18,
                fontWeight: 500,
                lineHeight: 1,
                color: "var(--hbt-ink)",
              }}
            >
              habibti<span style={{ color: "var(--hbt-sage-deep)" }}>.</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--hbt-brown-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              Admin
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--hbt-ink)",
            padding: 4,
          }}
        >
          {mobileOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42,34,24,0.35)",
            zIndex: 45,
          }}
          className="admin-mobile-overlay"
        />
      )}

      {/* Desktop sidebar / Mobile drawer */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--hbt-ink)",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
        className={`admin-sidebar${mobileOpen ? " admin-sidebar--open" : ""}`}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            padding: "8px 12px 20px",
          }}
        >
          <HbtLogo size={28} mono />
          <div>
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 18,
                fontWeight: 500,
                lineHeight: 1,
                color: "var(--hbt-cream-soft)",
              }}
            >
              habibti<span style={{ color: "var(--hbt-sage)" }}>.</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--hbt-brown-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              Admin
            </div>
          </div>
        </div>

        {/* Nav links */}
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                textDecoration: "none",
                background: active ? "rgba(250,246,240,0.12)" : "transparent",
                color: active ? "var(--hbt-cream-soft)" : "var(--hbt-brown-soft)",
                fontWeight: 600,
                fontSize: 13,
                transition: "background 0.15s, color 0.15s",
                borderLeft: active
                  ? "3px solid var(--hbt-sage)"
                  : "3px solid transparent",
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}

        {/* Bottom: view site link */}
        <div style={{ marginTop: "auto", padding: "10px 0" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 12,
              color: "var(--hbt-brown-soft)",
              fontWeight: 600,
              background: "transparent",
              transition: "background 0.15s",
            }}
          >
            ← View site
          </Link>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-bar { display: flex !important; }
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: -240px;
            height: 100vh;
            z-index: 50;
            transition: left 0.25s ease;
          }
          .admin-sidebar--open {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
