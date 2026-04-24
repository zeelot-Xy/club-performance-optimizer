import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatCard } from "../components/ui/stat-card";
import { StatusBadge } from "../components/ui/status-badge";
import { matchWeekStatusTone, recommendationStatusTone } from "../lib/formatters";
import { useDashboard } from "../hooks/use-dashboard";

export const DashboardPage = () => {
  const {
    isLoading,
    isError,
    error,
    activeMatchWeek,
    latestRecommendation,
    dashboardStats,
    readinessByUnit,
    weeklyTrend,
    players,
    matchWeeks,
  } = useDashboard();

  if (isLoading) {
    return <LoadingState title="Loading dashboard" description="Fetching live players, match weeks, and recommendations from the backend." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Dashboard data could not be loaded"
        description={error instanceof Error ? error.message : "The backend did not return dashboard data."}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 10 Integration"
        title="A calm tactical dashboard now backed by the real API"
        description="The dashboard no longer depends on Phase 9 mock state for its core views. Players, match weeks, and recommendation summaries are now derived from the backend using TanStack Query."
        actions={
          activeMatchWeek ? (
            <StatusBadge
              label={`${activeMatchWeek.label.toLowerCase()} ${activeMatchWeek.status.toLowerCase()}`}
              tone={matchWeekStatusTone(activeMatchWeek.status)}
            />
          ) : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Availability by Unit"
          description="This view derives a simple unit-readiness proxy from the live player registry, showing how much of each tactical group remains active for selection."
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessByUnit}>
                <CartesianGrid stroke="rgba(15,44,34,0.08)" vertical={false} />
                <XAxis dataKey="unit" tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(15,44,34,0.04)" }} />
                <Bar dataKey="readiness" radius={[14, 14, 4, 4]} fill="#0f2c22" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Current Match Activity"
          description="Live backend records are summarized here so the coach can immediately see whether the weekly planning cycle is ready for recommendation review."
        >
          <div className="grid gap-3">
            <article className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Active Match Week</p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">
                {activeMatchWeek ? `${activeMatchWeek.label} vs ${activeMatchWeek.opponentName}` : "No active match week yet"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {activeMatchWeek
                  ? activeMatchWeek.notes
                  : "Create a planning cycle in Match Weeks to start preparing a recommendation run."}
              </p>
            </article>

            <article className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Latest Recommendation</p>
                {latestRecommendation ? (
                  <StatusBadge label={latestRecommendation.status.toLowerCase()} tone={recommendationStatusTone(latestRecommendation.status)} />
                ) : null}
              </div>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">
                {latestRecommendation ? latestRecommendation.formation.code : "No recommendation stored yet"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {latestRecommendation
                  ? latestRecommendation.summary
                  : "Generate a recommendation from the Recommendations page after selecting a ready match week."}
              </p>
            </article>

            <article className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Registry Snapshot</p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">
                {players.length} players · {matchWeeks.length} match weeks
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                This confirms the frontend is drawing from the persisted backend dataset rather than local placeholders.
              </p>
            </article>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Weekly Progress Trend"
          description="A restrained progression view is derived from real match week statuses to show how preparation is moving across recent planning cycles."
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="readiness-fill-live" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0f2c22" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0f2c22" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(15,44,34,0.08)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: "rgba(15,44,34,0.18)" }} />
                <Area type="monotone" dataKey="readiness" stroke="#0f2c22" strokeWidth={2.5} fill="url(#readiness-fill-live)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Match Weeks"
          description="Recent planning cycles are listed from backend records so the coach can compare readiness stages and tactical notes."
        >
          <div className="grid gap-3">
            {matchWeeks.length ? (
              matchWeeks.map((week) => (
                <article key={week.id} className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{week.label}</p>
                      <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{week.opponentName}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{week.notes}</p>
                    </div>
                    <StatusBadge label={week.status.toLowerCase()} tone={matchWeekStatusTone(week.status)} />
                  </div>
                </article>
              ))
            ) : (
              <ErrorState title="No match weeks yet" description="Create a match week first so the dashboard can surface planning progress." />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
