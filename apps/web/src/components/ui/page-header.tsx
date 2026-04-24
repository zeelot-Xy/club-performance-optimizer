import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <header className="flex flex-col gap-5 rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,242,237,0.96))] p-7 shadow-[var(--shadow-card)] lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">{description}</p>
    </div>
    {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
  </header>
);
