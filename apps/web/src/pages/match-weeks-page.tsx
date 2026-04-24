import { useMemo, useState } from "react";
import { CalendarClock, NotebookPen, Plus } from "lucide-react";

import { MatchWeekForm } from "../components/forms/match-week-form";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { useMatchWeeks } from "../hooks/use-match-weeks";
import { formatDate, mapApiMatchWeekToRecord, matchWeekStatusTone } from "../lib/formatters";
import type { MatchWeekCreateInput } from "../types/ui";

export const MatchWeeksPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data, isLoading, isError, error, createMatchWeek } = useMatchWeeks();

  const matchWeeks = useMemo(() => (data ?? []).map(mapApiMatchWeekToRecord), [data]);
  const activeWeek =
    matchWeeks.find((week) => week.status === "READY") ??
    matchWeeks.find((week) => week.status === "DRAFT") ??
    matchWeeks[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly Planning"
        title="Track match preparation as discrete backend-backed planning cycles"
        description="Each match week is now loaded from the API and can be created from this page. This keeps the recommendation workflow anchored to one explicit weekly planning unit."
        actions={
          <button
            type="button"
            onClick={() => setShowCreateForm((current) => !current)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)]"
          >
            <Plus className="h-4 w-4" />
            {showCreateForm ? "Hide form" : "Add match week"}
          </button>
        }
      />

      {showCreateForm ? (
        <SectionCard
          title="Create Match Week"
          description="This form posts directly to the backend match weeks module and refreshes the planning register when successful."
        >
          <MatchWeekForm
            isSubmitting={createMatchWeek.isPending}
            onSubmit={async (payload: MatchWeekCreateInput) => {
              await createMatchWeek.mutateAsync(payload);
              setShowCreateForm(false);
            }}
          />
          {createMatchWeek.isError ? (
            <div className="mt-4">
              <ErrorState
                title="Match week creation failed"
                description={
                  createMatchWeek.error instanceof Error
                    ? createMatchWeek.error.message
                    : "The backend rejected the match week payload."
                }
              />
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Match Week Register"
          description="Statuses now come from real backend records and distinguish draft planning, ready cycles, and completed weeks."
        >
          {isLoading ? <LoadingState title="Loading match weeks" /> : null}
          {isError ? (
            <ErrorState
              title="Match weeks could not be loaded"
              description={error instanceof Error ? error.message : "The match weeks endpoint did not respond as expected."}
            />
          ) : null}
          {!isLoading && !isError && !matchWeeks.length ? (
            <EmptyState
              title="No match weeks created yet"
              description="Create a weekly planning cycle from this page before generating or reviewing recommendations."
            />
          ) : null}
          {!isLoading && !isError && matchWeeks.length ? (
            <div className="grid gap-3">
              {matchWeeks.map((week) => (
                <article key={week.id} className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.74)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{week.label}</p>
                      <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{week.opponentName}</h3>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{week.matchDate}</p>
                      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{week.notes}</p>
                    </div>
                    <StatusBadge label={week.status.toLowerCase()} tone={matchWeekStatusTone(week.status)} />
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="Active Week Summary"
            description="The right panel now reflects the active backend record instead of a static placeholder week."
          >
            {activeWeek ? (
              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-[rgba(15,44,34,0.06)] p-4">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-[var(--color-text-strong)]" />
                    <div>
                      <p className="font-semibold text-[var(--color-text-strong)]">{activeWeek.label}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{activeWeek.matchDate}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                    {activeWeek.opponentName} is the current preparation focus. The active status is {activeWeek.status.toLowerCase()}.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4">
                  <div className="flex items-center gap-3">
                    <NotebookPen className="h-5 w-5 text-[var(--color-text-strong)]" />
                    <p className="font-semibold text-[var(--color-text-strong)]">Coach Notes Preview</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{activeWeek.notes}</p>
                </div>
                {data?.find((week) => week.id === activeWeek.id)?.createdBy ? (
                  <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4 text-sm text-[var(--color-text-muted)]">
                    Created by {data.find((week) => week.id === activeWeek.id)?.createdBy?.fullName} on{" "}
                    {formatDate(data.find((week) => week.id === activeWeek.id)?.createdAt)}
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No active week"
                description="Once a match week exists, the active planning summary will appear here."
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
