import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description: string;
  action?: ReactNode;
};

export const ErrorState = ({
  title = "Something blocked this view",
  description,
  action,
}: ErrorStateProps) => (
  <div className="rounded-3xl border border-[rgba(165,71,67,0.16)] bg-[rgba(165,71,67,0.05)] px-6 py-6">
    <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
