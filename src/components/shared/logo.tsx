interface HbtLogoProps {
  size?: number;
  mono?: boolean;
}

export function HbtLogo({ size = 36, mono = false }: HbtLogoProps) {
  const tone = mono ? "currentColor" : "#5C4A3A";
  const sage = mono ? "currentColor" : "#7A8A6A";
  const pink = mono ? "currentColor" : "#E8C5B8";
  const bag  = mono ? "currentColor" : "#D4B896";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* crochet bag body */}
      <path
        d="M10 18 C10 16, 11 15, 13 15 L35 15 C37 15, 38 16, 38 18 L36.5 38 C36.3 40, 35 41, 33 41 L15 41 C13 41, 11.7 40, 11.5 38 Z"
        fill={bag} stroke={tone} strokeWidth="1.6" strokeLinejoin="round"
      />
      {/* crochet stitches grid */}
      <g stroke={tone} strokeWidth="0.7" opacity="0.55">
        <path d="M14 20 L34 20 M14 24 L34 24 M14 28 L34 28 M14 32 L34 32 M14 36 L34 36"/>
        <path d="M18 18 L18 40 M22 18 L22 40 M26 18 L26 40 M30 18 L30 40"/>
      </g>
      {/* handles */}
      <path
        d="M15 16 C15 9, 20 7, 24 7 C28 7, 33 9, 33 16"
        stroke={tone} strokeWidth="1.6" strokeLinecap="round" fill="none"
      />
      {/* soap bar peeking out */}
      <rect x="17" y="11" width="14" height="9" rx="2.4" fill={pink} stroke={tone} strokeWidth="1.4"/>
      <ellipse cx="22" cy="14" rx="1.4" ry="0.7" fill="#FFFFFF" opacity="0.7"/>
      {/* tiny sprig */}
      <path
        d="M24 7 L24 4 M24 5.5 C22.5 4.8, 22 4, 22 4 M24 4.5 C25.5 3.8, 26 3, 26 3"
        stroke={sage} strokeWidth="1.2" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

export function HbtWordmark({ small = false }: { small?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <HbtLogo size={small ? 28 : 36} />
      <span
        style={{
          fontFamily: "var(--hbt-serif)",
          fontWeight: 500,
          fontSize: small ? 18 : 22,
          letterSpacing: "-0.01em",
          color: "var(--hbt-ink)",
        }}
      >
        habibti
        <span style={{ color: "var(--hbt-sage-deep)" }}>.</span>
      </span>
    </div>
  );
}
