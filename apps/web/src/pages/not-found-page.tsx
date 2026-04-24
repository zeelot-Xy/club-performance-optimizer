import { Link } from "react-router-dom";

import { EmptyState } from "../components/ui/empty-state";

export const NotFoundPage = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="w-full max-w-xl space-y-6">
      <EmptyState
        title="This page is outside the planned route map"
        description="The project keeps the navigation intentionally small: dashboard, players, match weeks, and recommendations."
      />
      <div className="flex justify-center">
        <Link
          to="/"
          className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-surface)]"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  </div>
);
