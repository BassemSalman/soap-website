"use client";

interface BotanicalAccentProps {
  variant?: "a" | "b";
  style?: React.CSSProperties;
  className?: string;
}

export function BotanicalAccent({ variant = "a", style, className }: BotanicalAccentProps) {
  if (variant === "a") {
    return (
      <svg
        viewBox="0 0 200 200"
        style={style}
        className={className}
        fill="none"
        stroke="#7A8A6A"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M100 180 C 100 120, 100 60, 100 20"/>
        <path d="M100 60 C 70 50, 50 35, 50 35 M52 38 C 60 32, 78 38, 78 38"/>
        <path d="M100 90 C 130 78, 150 60, 150 60 M148 62 C 142 56, 122 62, 122 62"/>
        <path d="M100 120 C 78 110, 64 90, 64 90 M66 92 C 74 86, 86 96, 86 96"/>
        <path d="M100 150 C 124 142, 138 122, 138 122 M136 124 C 132 118, 116 124, 116 124"/>
        <path d="M100 30 C 90 22, 82 14, 82 14 M84 16 C 90 14, 96 22, 96 22"/>
        <path d="M100 30 C 110 22, 118 14, 118 14 M116 16 C 110 14, 104 22, 104 22"/>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 200 200"
      style={style}
      className={className}
      fill="none"
      stroke="#A8B89A"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M20 180 C 60 140, 100 100, 180 30"/>
      <ellipse cx="60" cy="140" rx="14" ry="6" transform="rotate(-30 60 140)" stroke="#A8B89A"/>
      <ellipse cx="100" cy="100" rx="14" ry="6" transform="rotate(-30 100 100)" stroke="#A8B89A"/>
      <ellipse cx="140" cy="60" rx="14" ry="6" transform="rotate(-30 140 60)" stroke="#A8B89A"/>
      <ellipse cx="80" cy="150" rx="10" ry="4" transform="rotate(60 80 150)" stroke="#A8B89A"/>
      <ellipse cx="120" cy="90" rx="10" ry="4" transform="rotate(60 120 90)" stroke="#A8B89A"/>
      <ellipse cx="160" cy="50" rx="10" ry="4" transform="rotate(60 160 50)" stroke="#A8B89A"/>
    </svg>
  );
}
