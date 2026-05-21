"use client";

interface BotanicalAccentProps {
  variant?: "a" | "b" | "c" | "d";
  style?: React.CSSProperties;
  className?: string;
  color?: string;
}

export function BotanicalAccent({ variant = "a", style, className, color }: BotanicalAccentProps) {
  if (variant === "a") {
    const stroke = color ?? "#7A8A6A";
    return (
      <svg
        viewBox="0 0 200 200"
        style={style}
        className={className}
        fill="none"
        stroke={stroke}
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

  if (variant === "b") {
    const stroke = color ?? "#A8B89A";
    return (
      <svg
        viewBox="0 0 200 200"
        style={style}
        className={className}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M20 180 C 60 140, 100 100, 180 30"/>
        <ellipse cx="60" cy="140" rx="14" ry="6" transform="rotate(-30 60 140)" stroke={stroke}/>
        <ellipse cx="100" cy="100" rx="14" ry="6" transform="rotate(-30 100 100)" stroke={stroke}/>
        <ellipse cx="140" cy="60" rx="14" ry="6" transform="rotate(-30 140 60)" stroke={stroke}/>
        <ellipse cx="80" cy="150" rx="10" ry="4" transform="rotate(60 80 150)" stroke={stroke}/>
        <ellipse cx="120" cy="90" rx="10" ry="4" transform="rotate(60 120 90)" stroke={stroke}/>
        <ellipse cx="160" cy="50" rx="10" ry="4" transform="rotate(60 160 50)" stroke={stroke}/>
      </svg>
    );
  }

  if (variant === "c") {
    // Daisy flower: 6 elliptical petals around a centre circle
    const stroke = color ?? "#7A8A6A";
    return (
      <svg
        viewBox="0 0 120 120"
        style={style}
        className={className}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <circle cx="60" cy="60" r="9"/>
        {/* 6 petals placed 60° apart at distance 26 from centre */}
        <ellipse cx="60" cy="34" rx="7" ry="12"/>
        <ellipse cx="82.5" cy="47" rx="7" ry="12" transform="rotate(60 82.5 47)"/>
        <ellipse cx="82.5" cy="73" rx="7" ry="12" transform="rotate(120 82.5 73)"/>
        <ellipse cx="60" cy="86" rx="7" ry="12"/>
        <ellipse cx="37.5" cy="73" rx="7" ry="12" transform="rotate(-120 37.5 73)"/>
        <ellipse cx="37.5" cy="47" rx="7" ry="12" transform="rotate(-60 37.5 47)"/>
      </svg>
    );
  }

  // variant "d" — sparkle cluster: three 4-pointed stars at varied sizes + dot accents
  const fill = color ?? "#A8B89A";
  return (
    <svg
      viewBox="0 0 160 160"
      style={style}
      className={className}
      fill="none"
    >
      {/* large sparkle */}
      <path
        d="M80,62 L86,74 L98,80 L86,86 L80,98 L74,86 L62,80 L74,74 Z"
        fill={fill}
        opacity="0.85"
      />
      {/* medium sparkle top-right */}
      <path
        d="M120,19 L124,26 L131,30 L124,34 L120,41 L116,34 L109,30 L116,26 Z"
        fill={fill}
        opacity="0.65"
      />
      {/* small sparkle bottom-left */}
      <path
        d="M30,110 L33,115 L38,118 L33,121 L30,126 L27,121 L22,118 L27,115 Z"
        fill={fill}
        opacity="0.55"
      />
      {/* tiny dot accents */}
      <circle cx="48" cy="38" r="2.5" fill={fill} opacity="0.5"/>
      <circle cx="132" cy="68" r="2" fill={fill} opacity="0.45"/>
      <circle cx="65" cy="130" r="2" fill={fill} opacity="0.4"/>
    </svg>
  );
}
