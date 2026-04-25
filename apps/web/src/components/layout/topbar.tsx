import { useState } from "react";
import { CalendarDays, LogOut, Search, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";
import { useClubs } from "../../hooks/use-clubs";
import { ClubWorkspaceManager } from "./club-workspace-manager";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/players": "Players",
  "/match-weeks": "Match Weeks",
  "/recommendations": "Recommendations",
  "/club-setup": "Club Setup",
};

export const Topbar = () => {
  const [showClubSwitcher, setShowClubSwitcher] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentClubQuery } = useClubs();
  const title = titleMap[location.pathname] ?? "Coach Workspace";
  const activeClub = currentClubQuery.data;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Weekly Match Preparation</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">{title}</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowClubSwitcher(true)}
            className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left text-sm text-[var(--color-text-muted)] transition hover:bg-white"
          >
            <Search className="h-4 w-4" />
            <span>{activeClub ? activeClub.name : "Club setup required"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowClubSwitcher(true)}
            className="flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)]"
          >
            <CalendarDays className="h-4 w-4" />
            {activeClub ? "Switch club" : "Import a club to continue"}
          </button>
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
      {showClubSwitcher ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,23,17,0.58)] p-4 backdrop-blur-sm"
          onClick={() => setShowClubSwitcher(false)}
          role="presentation"
        >
          <div
            className="grid-background max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-[0_34px_90px_rgba(7,23,17,0.28)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="club-switcher-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                  Club workspace
                </p>
                <h2
                  id="club-switcher-title"
                  className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]"
                >
                  Switch or import a club
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)]">
                  One club stays active at a time, but you can switch workspaces whenever you need
                  to compare planning contexts or import another club.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowClubSwitcher(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white/70 text-[var(--color-text-strong)] transition hover:bg-white"
                aria-label="Close club workspace manager"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6">
              <ClubWorkspaceManager mode="panel" onComplete={() => setShowClubSwitcher(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
