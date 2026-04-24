import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { FootballPitch } from "../components/pitch/football-pitch";
import { FormationSelector } from "../components/recommendations/formation-selector";
import { LineupSummary } from "../components/recommendations/lineup-summary";
import { RecommendationExplanation } from "../components/recommendations/recommendation-explanation";
import { recommendation } from "../lib/mock-data";

export const RecommendationsPage = () => {
  if (!recommendation) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Recommendation Review"
          title="No weekly recommendation is available yet"
          description="The explainable recommendation view will appear here once the current match week has enough readiness data and a generation run is completed."
        />
        <EmptyState
          title="Recommendation pending"
          description="Enter weekly performance data, verify player availability, and run generation before reviewing the formation and lineup."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recommendation Review"
        title="Explainable lineup guidance with formation context and on-pitch visualization"
        description="This page is the heart of the product. It presents the weekly starting XI in a tactical layout, explains why the chosen structure won, and keeps exclusions visible for accountability."
        actions={<StatusBadge label={recommendation.status.toLowerCase()} tone="success" />}
      />

      <SectionCard
        title={`${recommendation.matchWeekLabel} vs ${recommendation.opponentName}`}
        description="The formation set is controlled and limited on purpose, so coaches review a defensible shortlist instead of an opaque unlimited search space."
      >
        <FormationSelector activeFormation={recommendation.formation} />
      </SectionCard>

      <div className="grid gap-5 2xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard
          title={`Pitch View · ${recommendation.formation}`}
          description="A calm tactical pitch helps the coach interpret spacing, unit balance, and role placement without relying on flashy animation."
        >
          <FootballPitch formation={recommendation.formation} lineup={recommendation.lineup} />
        </SectionCard>

        <SectionCard
          title="Starting XI Summary"
          description="Selected starters are listed with their weekly rationale so the coach can trace the recommendation beyond a single score."
        >
          <LineupSummary recommendation={recommendation} />
        </SectionCard>
      </div>

      <RecommendationExplanation recommendation={recommendation} />
    </div>
  );
};
