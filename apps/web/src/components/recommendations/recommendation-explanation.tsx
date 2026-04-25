import type { RecommendationRecord } from "../../types/ui";
import { SectionCard } from "../ui/section-card";
import { StatusBadge } from "../ui/status-badge";

type RecommendationExplanationProps = {
  recommendation: RecommendationRecord;
};

export const RecommendationExplanation = ({ recommendation }: RecommendationExplanationProps) => (
  <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
    <SectionCard
      title="Why this recommendation was selected"
      description="Review the core reasoning behind the chosen formation and the selected starters for this week."
    >
      <div className="space-y-4">
        <p className="rounded-[1.5rem] bg-[rgba(15,44,34,0.06)] p-4 text-sm leading-7 text-[var(--color-text-strong)]">
          {recommendation.summary}
        </p>
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{recommendation.ruleScoreSummary}</p>
        <ul className="space-y-3">
          {recommendation.explanationHighlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-[1.2rem] border border-[rgba(15,44,34,0.08)] bg-white/70 px-4 py-3 text-sm leading-6 text-[var(--color-text-strong)]"
            >
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>

    <SectionCard title="Exclusions and ML support" description="Players left out this week are shown with clear reasons, while ML input remains advisory only.">
      <div className="space-y-5">
        <div className="space-y-3">
          {recommendation.excludedPlayers.length ? (
            recommendation.excludedPlayers.map((player) => (
              <div
                key={player.id}
                className="rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.7)] p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-text-strong)]">
                      #{player.squadNumber} {player.fullName}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{player.reason}</p>
                  </div>
                  <StatusBadge
                    label={player.status.toLowerCase()}
                    tone={player.status === "INJURED" ? "danger" : "warning"}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.7)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
              No notable exclusions were recorded for this recommendation run.
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-[rgba(15,44,34,0.08)] bg-[rgba(15,44,34,0.06)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">ML support summary</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-strong)]">
            {recommendation.mlSupportSummary ?? "No ML support summary was recorded for this recommendation run."}
          </p>
        </div>
      </div>
    </SectionCard>
  </div>
);
