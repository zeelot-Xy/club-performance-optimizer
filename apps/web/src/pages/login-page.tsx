import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import { LoginForm } from "../components/auth/login-form";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../lib/api-client";

export const LoginPage = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const helperText = useMemo(
    () =>
      "Use the seeded development credential for Phase 10 integration: admin@club.local / Admin123!",
    [],
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-strong)]">
      <div className="grid-background flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2.4rem] border border-[rgba(248,250,247,0.08)] bg-[linear-gradient(160deg,rgba(7,23,17,0.95),rgba(15,44,34,0.98))] p-8 text-[var(--color-surface)] shadow-[0_30px_90px_rgba(7,23,17,0.26)]">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[rgba(248,250,247,0.56)]">Coach Console</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Club Performance and Formation Optimizer</h1>
            <p className="mt-5 text-sm leading-7 text-[rgba(248,250,247,0.78)]">
              The frontend is now wired to the real backend API. Sign in to review players, match weeks, and explainable recommendations from the live service layer.
            </p>
            <div className="mt-8 rounded-[1.8rem] border border-[rgba(248,250,247,0.08)] bg-[rgba(248,250,247,0.05)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgba(248,250,247,0.6)]">Integration Note</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(248,250,247,0.82)]">{helperText}</p>
            </div>
          </section>

          <section className="rounded-[2.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Phase 10</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">Sign in</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              Auth state is now persisted locally and verified against the backend using TanStack Query.
            </p>

            <div className="mt-8">
              <LoginForm
                isSubmitting={isSubmitting || isLoading}
                errorMessage={errorMessage}
                onSubmit={async (email, password) => {
                  setIsSubmitting(true);
                  setErrorMessage(null);

                  try {
                    await login(email, password);
                  } catch (error) {
                    setErrorMessage(
                      error instanceof ApiError ? error.message : "Unable to sign in right now.",
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
