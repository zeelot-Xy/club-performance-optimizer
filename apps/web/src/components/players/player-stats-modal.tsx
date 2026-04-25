import { useEffect } from "react";
import { X } from "lucide-react";

import { usePlayerDetails } from "../../hooks/use-player-details";
import {
  formatDate,
  mapApiPlayerDetailsToModalRecord,
  playerStatusTone,
  toTitleCase,
} from "../../lib/formatters";
import { EmptyState } from "../ui/empty-state";
import { ErrorState } from "../ui/error-state";
import { LoadingState } from "../ui/loading-state";
import { StatusBadge } from "../ui/status-badge";

type PlayerStatsModalProps = {
  playerId?: string | null;
  matchWeekId?: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl bg-[rgba(15,44,34,0.04)] px-4 py-3">
    <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
    <span className="text-right text-sm font-medium text-[var(--color-text-strong)]">{value}</span>
  </div>
);

export const PlayerStatsModal = ({
  playerId,
  matchWeekId,
  isOpen,
  onClose,
}: PlayerStatsModalProps) => {
  const { data, isLoading, isError, error } = usePlayerDetails(
    isOpen ? playerId : null,
    matchWeekId,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !playerId) {
    return null;
  }

  const record = data ? mapApiPlayerDetailsToModalRecord(data) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,23,17,0.58)] p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="grid-background max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-[0_34px_90px_rgba(7,23,17,0.28)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-stats-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              Player details
            </p>
            <h2
              id="player-stats-modal-title"
              className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]"
            >
              {record ? `${record.fullName} (#${record.squadNumber})` : "Loading player details"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white/70 text-[var(--color-text-strong)] transition hover:bg-white"
            aria-label="Close player details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingState title="Loading player details" description="Preparing profile and weekly performance information." />
          ) : null}

          {isError ? (
            <ErrorState
              title="Player details could not be loaded"
              description={error instanceof Error ? error.message : "The player details are not available right now."}
            />
          ) : null}

          {record ? (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="space-y-4 rounded-[1.75rem] border border-[var(--color-border)] bg-white/72 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                      Profile
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">
                      {record.primaryPosition}
                    </p>
                  </div>
                  <StatusBadge
                    label={record.status.toLowerCase()}
                    tone={playerStatusTone(record.status)}
                  />
                </div>

                <div className="grid gap-3">
                  <StatRow label="Primary position" value={record.primaryPosition} />
                  <StatRow
                    label="Secondary position"
                    value={record.secondaryPosition ?? "Not recorded"}
                  />
                  <StatRow label="Position group" value={toTitleCase(record.positionGroup)} />
                  <StatRow label="Preferred foot" value={toTitleCase(record.preferredFoot)} />
                  <StatRow label="Age" value={`${record.age} years`} />
                  <StatRow
                    label="Height"
                    value={record.heightCm ? `${record.heightCm} cm` : "Not recorded"}
                  />
                  <StatRow label="Created" value={formatDate(data?.player.createdAt)} />
                </div>
              </section>

              <section className="space-y-4 rounded-[1.75rem] border border-[var(--color-border)] bg-white/72 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    Weekly performance
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">
                    {record.weeklyStats
                      ? `${record.weeklyStats.matchWeekLabel} vs ${record.weeklyStats.opponentName}`
                      : "No weekly stats available"}
                  </p>
                  {record.weeklyStats ? (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {record.weeklyStats.matchDate}
                    </p>
                  ) : null}
                </div>

                {record.weeklyStats ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <StatRow label="Training rating" value={`${record.weeklyStats.trainingRating}/10`} />
                      <StatRow label="Fitness" value={`${record.weeklyStats.fitness}/100`} />
                      <StatRow label="Fatigue" value={`${record.weeklyStats.fatigue}/100`} />
                      <StatRow label="Morale" value={`${record.weeklyStats.morale}/100`} />
                      <StatRow label="Availability" value={toTitleCase(record.weeklyStats.availability)} />
                      <StatRow label="Injury status" value={toTitleCase(record.weeklyStats.injuryStatus)} />
                      <StatRow
                        label="Suspension status"
                        value={toTitleCase(record.weeklyStats.suspensionStatus)}
                      />
                    </div>
                    <div className="rounded-[1.4rem] bg-[rgba(15,44,34,0.05)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        Coach notes
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-text-strong)]">
                        {record.weeklyStats.coachNotes}
                      </p>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="No weekly stats recorded yet"
                    description="This player profile is available, but there are no weekly performance values to show for the selected context yet."
                  />
                )}
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
