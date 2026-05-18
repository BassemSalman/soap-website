interface TrustRowProps {
  isDesktop?: boolean;
}

const IconLeaf = () => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 4S9 3 5 9c-3 5 1 11 1 11s7-1 11-5 3-11 3-11z" />
    <path d="M5 19c2-5 6-9 12-12" />
  </svg>
);

const IconHand = () => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11M12 11V4.5a1.5 1.5 0 0 1 3 0V11M15 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-12 0v-2.5a1.5 1.5 0 0 1 3 0V13" />
  </svg>
);

const IconGift = () => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 13h18M12 8v13" />
    <path d="M12 8c-2 0-3-1-3-2.5S10 3 12 3c2 0 3 1 3 2.5S14 8 12 8z" />
  </svg>
);

const IconTruck = () => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="6" width="13" height="11" rx="1" />
    <path d="M15 9h4l3 4v4h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const items = [
  {
    icon: <IconLeaf />,
    label: "Certified Organic",
    sub: "All raw materials traceable",
  },
  {
    icon: <IconHand />,
    label: "Made by Hand",
    sub: "Small batches, twice weekly",
  },
  {
    icon: <IconGift />,
    label: "Customisable",
    sub: "Personal letter, your colour",
  },
  {
    icon: <IconTruck />,
    label: "Lebanese Delivery",
    sub: "All regions, 2–3 days",
  },
];

export function TrustRow({ isDesktop }: TrustRowProps) {
  return (
    <div
      className="grid overflow-hidden rounded-[var(--r-lg)] border border-[var(--line-soft)] bg-[var(--line-soft)]"
      style={{
        gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
        gap: isDesktop ? 4 : 1,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-[var(--cream-soft)] flex items-start gap-3.5"
          style={{
            padding: isDesktop ? "22px 20px" : "18px 14px",
            flexDirection: isDesktop ? "row" : "column",
            alignItems: isDesktop ? "center" : "flex-start",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-[var(--sage-wash)] text-[var(--sage-deep)] flex items-center justify-center shrink-0">
            {item.icon}
          </div>
          <div>
            <div
              className="font-medium"
              style={{
                fontFamily: "var(--serif)",
                fontSize: isDesktop ? 16 : 14,
              }}
            >
              {item.label}
            </div>
            <div className="text-[12px] text-[var(--brown-soft)] mt-0.5">
              {item.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
