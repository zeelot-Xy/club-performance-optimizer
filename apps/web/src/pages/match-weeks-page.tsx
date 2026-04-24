import { CalendarClock, NotebookPen } from "lucide-react";

import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { matchWeeks } from "../lib/mock-data";

const activeWeek = matchWeeks[0];

export const MatchWeeksPage = () => (
  <div className="space-y-6">
    <PageHeader
      eyebrow="Weekly Planning"
      title="Track match preparation as discrete weekly decision cycles"
      description="Each match week acts as the planning container for availability, readiness, recommendation generation, and coach review. This keeps the project aligned with the strict weekly decision-support scope."
    />

    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard title="Match Week Register" description="Statuses distinguish between weeks still being prepared, weeks ready for recommendation review, and archived completed weeks.">
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
                <StatusBadge
                  label={week.status.toLowerCase()}
                  tone={week.status === "READY" ? "success" : week.status === "PLANNING" ? "warning" : "default"}
                />
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="Active Week Summary" description="The right panel gives the coach a concise planning snapshot without requiring a deeper navigation step.">
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
                {activeWeek.opponentName} is the current preparation focus. Weekly data completion is at {activeWeek.completion}%.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4">
              <div className="flex items-center gap-3">
                <NotebookPen className="h-5 w-5 text-[var(--color-text-strong)]" />
                <p className="font-semibold text-[var(--color-text-strong)]">Coach Notes Preview</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{activeWeek.notes}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
);
