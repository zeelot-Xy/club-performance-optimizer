import { CircleAlert } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[rgba(255,255,255,0.68)] px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,44,34,0.08)] text-[var(--color-text-strong)]">
      <CircleAlert className="h-5 w-5" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-strong)]">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
  </div>
);
