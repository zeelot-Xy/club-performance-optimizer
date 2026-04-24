import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { FootballPitch } from "../components/pitch/football-pitch";
import { FormationSelector } from "../components/recommendations/formation-selector";
import { LineupSummary } from "../components/recommendations/lineup-summary";
import { RecommendationExplanation } from "../components/recommendations/recommendation-explanation";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { useFormations } from "../hooks/use-formations";
import { useMatchWeeks } from "../hooks/use-match-weeks";
import { useRecommendations } from "../hooks/use-recommendations";
import { mapApiMatchWeekToRecord, mapApiRecommendationToRecord, matchWeekStatusTone, recommendationStatusTone } from "../lib/formatters";

export const RecommendationsPage = () => {
  const [selectedMatchWeekId, setSelectedMatchWeekId] = useState<string>("");
  const { data: formations, isLoading: formationsLoading } = useFormations();
  const { data: matchWeeksData, isLoading: matchWeeksLoading, isError: matchWeeksError, error: matchWeeksQueryError } = useMatchWeeks();
  const { byMatchWeekQuery, generateRecommendation } = useRecommendations(selectedMatchWeekId || undefined);

  const matchWeeks = useMemo(
    () => (matchWeeksData ?? []).map(mapApiMatchWeekToRecord),
    [matchWeeksData],
  );

  useEffect(() => {
    if (!selectedMatchWeekId && matchWeeksData?.length) {
      const preferred =
        matchWeeksData.find((week) => week.status === "READY") ??
        matchWeeksData.find((week) => week.status === "DRAFT") ??
        matchWeeksData[0];

      setSelectedMatchWeekId(preferred.id);
    }
  }, [selectedMatchWeekId, matchWeeksData]);

  const selectedMatchWeek = matchWeeks.find((week) => week.id === selectedMatchWeekId);
  const recommendation = byMatchWeekQuery.data
    ? mapApiRecommendationToRecord(byMatchWeekQuery.data)
    : null;

  const pageLoading = matchWeeksLoading || (selectedMatchWeekId ? byMatchWeekQuery.isLoading : false);

  if (pageLoading || formationsLoading) {
    return (
      <LoadingState
        title="Loading recommendation workspace"
        description="Fetching live formations, match weeks, and stored recommendations from the backend."
      />
    );
  }

  if (matchWeeksError) {
    return (
      <ErrorState
        title="Match week data is unavailable"
        description={
          matchWeeksQueryError instanceof Error
            ? matchWeeksQueryError.message
            : "The recommendation page cannot proceed without match week records."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recommendation Review"
        title="Explainable lineup guidance now driven by backend generation"
        description="This page now loads real recommendation records, lets the coach choose a match week, and can trigger a new backend generation run from the UI."
        actions={
          recommendation ? (
            <StatusBadge label={recommendation.status.toLowerCase()} tone={recommendationStatusTone(recommendation.status)} />
          ) : selectedMatchWeek ? (
            <StatusBadge label={selectedMatchWeek.status.toLowerCase()} tone={matchWeekStatusTone(selectedMatchWeek.status)} />
          ) : undefined
        }
      />

      <SectionCard
        title="Recommendation Controls"
        description="Choose the planning cycle to review, then trigger the recommendation engine. The final lineup and its explanations always come from the backend."
        action={
          <button
            type="button"
            onClick={() => selectedMatchWeekId && generateRecommendation.mutate(selectedMatchWeekId)}
            disabled={!selectedMatchWeekId || generateRecommendation.isPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${generateRecommendation.isPending ? "animate-spin" : ""}`} />
            {generateRecommendation.isPending ? "Generating..." : "Generate recommendation"}
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <span>Match week</span>
            <select
              value={selectedMatchWeekId}
              onChange={(event) => setSelectedMatchWeekId(event.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
            >
              <option value="">Select a match week</option>
              {matchWeeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.label} · {week.opponentName}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Supported formations</p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              {formations?.map((formation) => formation.code).join(", ") ??
                "No active formations returned by the backend."}
            </p>
          </div>
        </div>
        {generateRecommendation.isError ? (
          <div className="mt-4">
            <ErrorState
              title="Recommendation generation failed"
              description={
                generateRecommendation.error instanceof Error
                  ? generateRecommendation.error.message
                  : "The backend could not generate a recommendation for this match week."
              }
            />
          </div>
        ) : null}
      </SectionCard>

      {!selectedMatchWeekId ? (
        <EmptyState
          title="Choose a match week first"
          description="Select one of the stored planning cycles above to fetch or generate its recommendation."
        />
      ) : null}

      {selectedMatchWeekId && byMatchWeekQuery.isError ? (
        <ErrorState
          title="Recommendation data could not be loaded"
          description={
            byMatchWeekQuery.error instanceof Error
              ? byMatchWeekQuery.error.message
              : "The recommendation endpoint returned an unexpected error."
          }
        />
      ) : null}

      {selectedMatchWeekId && !byMatchWeekQuery.isError && !recommendation ? (
        <EmptyState
          title="No recommendation stored for this match week yet"
          description="Use the generate action above to run the rule-based engine and store a new explainable recommendation."
        />
      ) : null}

      {recommendation ? (
        <>
          <SectionCard
            title={`${recommendation.matchWeekLabel} vs ${recommendation.opponentName}`}
            description="The formation set remains controlled on purpose, so the coach reviews a defendable shortlist rather than an opaque unrestricted search."
          >
            <FormationSelector activeFormation={recommendation.formation} />
          </SectionCard>

          <div className="grid gap-5 2xl:grid-cols-[1.08fr_0.92fr]">
            <SectionCard
              title={`Pitch View · ${recommendation.formation}`}
              description="The pitch view is now driven by the backend-selected starting XI and its tactical grouping."
            >
              <FootballPitch formation={recommendation.formation} lineup={recommendation.lineup} />
            </SectionCard>

            <SectionCard
              title="Starting XI Summary"
              description="These player reasons are displayed exactly from backend-generated selection reasoning, not recreated in the browser."
            >
              <LineupSummary recommendation={recommendation} />
            </SectionCard>
          </div>

          <RecommendationExplanation recommendation={recommendation} />
        </>
      ) : null}
    </div>
  );
};
