type StatusBadgeProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneClassMap: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  default: "bg-[rgba(15,44,34,0.08)] text-[var(--color-text-strong)]",
  success: "bg-[rgba(56,128,84,0.14)] text-[var(--color-success)]",
  warning: "bg-[rgba(184,132,47,0.16)] text-[var(--color-warning)]",
  danger: "bg-[rgba(165,71,67,0.14)] text-[var(--color-danger)]",
};

export const StatusBadge = ({ label, tone = "default" }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClassMap[tone]}`}
  >
    {label}
  </span>
);
