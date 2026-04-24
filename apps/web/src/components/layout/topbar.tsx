import { CalendarDays, Search, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/players": "Players",
  "/match-weeks": "Match Weeks",
  "/recommendations": "Recommendations",
};

export const Topbar = () => {
  const location = useLocation();
  const title = titleMap[location.pathname] ?? "Coach Workspace";

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Weekly Match Preparation</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">{title}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
          <Search className="h-4 w-4" />
          Search remains local in Phase 9
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)]">
          <CalendarDays className="h-4 w-4" />
          Week 7 active
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.6)] px-4 py-3 text-sm text-[var(--color-text-muted)] lg:flex">
          <Sparkles className="h-4 w-4 text-[var(--color-success)]" />
          Explainable mode
        </div>
      </div>
    </div>
  );
};
