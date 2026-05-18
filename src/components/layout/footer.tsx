import Link from "next/link";
import { HbtWordmark } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--hbt-brown)",
        color: "var(--hbt-cream-soft)",
        padding: "48px 32px 32px",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
                { href: "/", label: "Delivery info" },
                { href: "/", label: "Contact us" },
              ].map((link) => (
                <Link
                  key={link.label}
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
