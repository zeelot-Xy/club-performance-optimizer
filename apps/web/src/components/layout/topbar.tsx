import { CalendarDays, LogOut, Search, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";
import { useClubs } from "../../hooks/use-clubs";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/players": "Players",
  "/match-weeks": "Match Weeks",
  "/recommendations": "Recommendations",
  "/club-setup": "Club Setup",
};

export const Topbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentClubQuery } = useClubs();
  const title = titleMap[location.pathname] ?? "Coach Workspace";
  const activeClub = currentClubQuery.data;

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Weekly Match Preparation</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">{title}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
          <Search className="h-4 w-4" />
          {activeClub ? activeClub.name : "Club setup required"}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)]">
          <CalendarDays className="h-4 w-4" />
          {activeClub ? "Selected-club workflow" : "Import a club to continue"}
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.6)] px-4 py-3 text-sm text-[var(--color-text-muted)] lg:flex">
          <Sparkles className="h-4 w-4 text-[var(--color-success)]" />
          Fairness, welfare, and performance
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[var(--color-text-strong)]">{user?.fullName ?? "Coach/Admin"}</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {activeClub?.competition ?? user?.email ?? "Authorized club account"}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-strong)]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
