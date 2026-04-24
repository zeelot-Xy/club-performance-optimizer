type LoadingStateProps = {
  title?: string;
  description?: string;
};

export const LoadingState = ({
  title = "Loading data",
  description = "The interface is synchronizing with the backend services.",
}: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-6 py-12 text-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgba(15,44,34,0.12)] border-t-[var(--color-primary)]" />
    <h3 className="mt-5 text-lg font-semibold text-[var(--color-text-strong)]">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
  </div>
);
