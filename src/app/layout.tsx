import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Habibti — Organic Handmade Soap & Skincare",
  description:
    "Small-batch organic soap, cream and serum made by hand in Beirut. Delivered across Lebanon with a hand-crochet bag and a card you write yourself.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--hbt-sans)",
          background: "var(--hbt-cream)",
          color: "var(--hbt-ink)",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
