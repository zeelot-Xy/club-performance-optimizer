import type { RecommendationRecord } from "../../types/ui";
import { StatusBadge } from "../ui/status-badge";

type LineupSummaryProps = {
  recommendation: RecommendationRecord;
};

export const LineupSummary = ({ recommendation }: LineupSummaryProps) => (
  <div className="grid gap-3">
    {recommendation.lineup.map((player) => (
      <article
        key={player.id}
        className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              #{player.squadNumber} {player.positionLabel}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{player.fullName}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{player.reason}</p>
          </div>
          <StatusBadge label={`${player.readinessScore} readiness`} tone="success" />
        </div>
      </article>
    ))}
  </div>
);
