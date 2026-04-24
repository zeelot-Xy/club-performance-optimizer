import type { PropsWithChildren, ReactNode } from "react";

type SectionCardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}>;

export const SectionCard = ({
  title,
  description,
  action,
  className = "",
  children,
}: SectionCardProps) => (
  <section className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-card)] ${className}`.trim()}>
    {(title || description || action) && (
      <div className="mb-5 flex flex-col gap-4 border-b border-[rgba(15,44,34,0.08)] pb-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          {title ? <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">{title}</h2> : null}
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
