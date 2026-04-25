import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatCard } from "../components/ui/stat-card";
import { StatusBadge } from "../components/ui/status-badge";
import { useDashboard } from "../hooks/use-dashboard";
import { matchWeekStatusTone, recommendationStatusTone } from "../lib/formatters";

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
    return <LoadingState title="Loading dashboard" description="Gathering squad, match week, and recommendation information." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Dashboard data could not be loaded"
        description={error instanceof Error ? error.message : "The dashboard information is not available right now."}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly Overview"
        title="Review squad readiness and weekly decision context"
        description="This dashboard brings together the current squad picture, match preparation status, and the latest recommendation summary in one calm operational view."
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
          description="This view compares how much of each tactical unit remains available for selection ahead of the next recommendation."
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
          description="Use this section to confirm whether the current planning cycle is ready for recommendation review."
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
                {players.length} players | {matchWeeks.length} match weeks
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                This snapshot gives a quick sense of how much current planning information is already available in the system.
              </p>
            </article>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Weekly Progress Trend"
          description="Track how recent planning cycles have progressed from draft preparation to recommendation-ready status."
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
          description="Review recent planning cycles, their readiness stages, and the tactical notes recorded for each one."
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
