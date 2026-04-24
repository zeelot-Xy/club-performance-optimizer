import { Activity, CalendarCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatCard } from "../components/ui/stat-card";
import { StatusBadge } from "../components/ui/status-badge";
import { dashboardStats, matchWeeks, readinessByUnit, recommendation, weeklyTrend } from "../lib/mock-data";

const activityCards = [
  {
    label: "Active Match Week",
    value: recommendation.matchWeekLabel,
    description: `${recommendation.opponentName} preparation is currently the primary planning focus.`,
    icon: CalendarCheck2,
  },
  {
    label: "Recommendation Status",
    value: recommendation.status === "READY" ? "Ready" : "Attention Needed",
    description: "The latest recommendation can be reviewed before final XI confirmation.",
    icon: ShieldCheck,
  },
  {
    label: "Eligible Core",
    value: "17 players",
    description: "Enough eligible players remain to sustain tactical alternatives if needed.",
    icon: UsersRound,
  },
  {
    label: "Explainability",
    value: "Primary",
    description: "Rule-based scoring remains the main decision layer for coach review.",
    icon: Activity,
  },
];

export const DashboardPage = () => (
  <div className="space-y-6">
    <PageHeader
      eyebrow="Phase 9 Frontend"
      title="A calm tactical dashboard for weekly football decision support"
      description="This interface is intentionally structured for one Coach/Admin user. It keeps availability, weekly readiness, and explainable recommendation signals visible without drifting into noisy consumer-style presentation."
      actions={<StatusBadge label="Week 7 ready" tone="success" />}
    />

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <SectionCard title="Readiness by Unit" description="A compact view of how the squad currently distributes readiness across the four tactical groups.">
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

      <SectionCard title="Current Match Activity" description="High-level monitoring cards for the active weekly preparation cycle.">
        <div className="grid gap-3">
          {activityCards.map(({ label, value, description, icon: Icon }) => (
            <article key={label} className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
                </div>
                <div className="rounded-2xl bg-[rgba(15,44,34,0.08)] p-3 text-[var(--color-text-strong)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>

    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Weekly Readiness Trend" description="A restrained trend view helps the coach see whether the current squad preparation is stabilizing or declining.">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="readiness-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f2c22" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0f2c22" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(15,44,34,0.08)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4e635b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ stroke: "rgba(15,44,34,0.18)" }} />
              <Area type="monotone" dataKey="readiness" stroke="#0f2c22" strokeWidth={2.5} fill="url(#readiness-fill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Recent Match Weeks" description="Short summaries help the coach move between planning, ready, and completed weekly contexts quickly.">
        <div className="grid gap-3">
          {matchWeeks.map((week) => (
            <article key={week.id} className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{week.label}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-strong)]">{week.opponentName}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{week.notes}</p>
                </div>
                <StatusBadge
                  label={week.status.toLowerCase()}
                  tone={week.status === "READY" ? "success" : week.status === "PLANNING" ? "warning" : "default"}
                />
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);
