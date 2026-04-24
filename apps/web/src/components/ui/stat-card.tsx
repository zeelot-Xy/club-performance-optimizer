import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  tone?: "default" | "success" | "warning";
};

const accentClassMap = {
  default: "from-[rgba(15,44,34,0.08)] to-[rgba(15,44,34,0.03)] text-[var(--color-text-strong)]",
  success: "from-[rgba(56,128,84,0.18)] to-[rgba(56,128,84,0.04)] text-[var(--color-success)]",
  warning: "from-[rgba(184,132,47,0.2)] to-[rgba(184,132,47,0.05)] text-[var(--color-warning)]",
};

export const StatCard = ({ label, value, trend, tone = "default" }: StatCardProps) => (
  <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-soft)]">
    <div className={`inline-flex rounded-2xl bg-gradient-to-br px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${accentClassMap[tone]}`}>
      {label}
    </div>
    <div className="mt-5 flex items-end justify-between gap-3">
      <div>
        <p className="text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">{value}</p>
        <p className="mt-2 max-w-[18rem] text-sm leading-6 text-[var(--color-text-muted)]">{trend}</p>
      </div>
      <div className="rounded-2xl border border-[rgba(15,44,34,0.08)] p-3 text-[var(--color-text-muted)]">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  </article>
);
