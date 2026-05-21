"use client";

import Link from "next/link";
import { HbtWordmark } from "@/components/shared/logo";
import { BotanicalAccent } from "@/components/shared/botanical-accent";
import { IconInstagram, IconTiktok, IconWhatsapp } from "@/components/shared/icons";

export function Footer() {
  const socialLinks = [
    { href: "https://instagram.com", icon: <IconInstagram size={18} />, label: "Instagram" },
    { href: "https://tiktok.com", icon: <IconTiktok size={18} />, label: "TikTok" },
    {
      href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`,
      icon: <IconWhatsapp size={18} />,
      label: "WhatsApp",
    },
  ];

  return (
    <footer
      style={{
        background: "var(--hbt-brown)",
        color: "var(--hbt-cream-soft)",
        padding: "48px 32px 32px",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background botanical decorations */}
      <BotanicalAccent
        variant="a"
        color="rgba(250,246,240,0.1)"
        style={{ position: "absolute", top: -20, right: -10, width: 200, pointerEvents: "none" }}
      />
      <BotanicalAccent
        variant="d"
        color="rgba(250,246,240,0.08)"
        style={{ position: "absolute", bottom: 10, left: "40%", width: 120, pointerEvents: "none" }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 32,
            marginBottom: 40,
          }}
        >
          <div>
            <HbtWordmark />
            <p
              style={{
                marginTop: 12,
                fontSize: 13,
                color: "rgba(250,246,240,0.65)",
                lineHeight: 1.6,
              }}
            >
              Small-batch organic soap &amp; skincare, made by hand in Beirut.
            </p>
            {/* Social media icons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(250,246,240,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(250,246,240,0.7)",
                    textDecoration: "none",
                    transition: "background .18s ease, color .18s ease, border-color .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(250,246,240,0.12)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(250,246,240,1)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(250,246,240,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(250,246,240,0.7)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(250,246,240,0.2)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(250,246,240,0.5)",
                marginBottom: 12,
              }}
            >
              Shop
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/products", label: "All products" },
                { href: "/basket-builder", label: "Build a gift basket" },
                { href: "/products?cat=soaps", label: "Soaps" },
                { href: "/products?cat=creams", label: "Creams" },
                { href: "/products?cat=serums", label: "Serums" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 13,
                    color: "rgba(250,246,240,0.75)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(250,246,240,0.5)",
                marginBottom: 12,
              }}
            >
              Help
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/account/orders", label: "Track my order" },
                { href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`, label: "Contact us", external: true },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{ fontSize: 13, color: "rgba(250,246,240,0.75)", textDecoration: "none" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(250,246,240,0.12)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 12,
            color: "rgba(250,246,240,0.4)",
          }}
        >
          <span>© {new Date().getFullYear()} Habibti. Made with care in Beirut.</span>
          <span>Cash on delivery · Lebanon-wide</span>
        </div>
      </div>
    </footer>
  );
}
