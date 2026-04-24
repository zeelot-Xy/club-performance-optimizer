import { Search, SlidersHorizontal } from "lucide-react";

import { DataTable } from "../components/ui/data-table";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { players } from "../lib/mock-data";
import type { PlayerRecord } from "../types/ui";

const getStatusTone = (status: PlayerRecord["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INJURED":
    case "UNAVAILABLE":
      return "danger";
    default:
      return "warning";
  }
};

export const PlayersPage = () => (
  <div className="space-y-6">
    <PageHeader
      eyebrow="Squad Overview"
      title="A controlled one-club player view for selection and monitoring"
      description="The player screen stays compact and managerial. It helps the coach inspect squad depth, role balance, and readiness without mixing in unnecessary league-wide features."
      actions={
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text-muted)]">
            <Search className="h-4 w-4" />
            Search UI placeholder
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text-muted)] sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
            Filters placeholder
          </div>
        </div>
      }
    />

    <SectionCard title="Registered Squad" description="Phase 9 uses realistic mock data so the interface can be reviewed before the live API integration in Phase 10.">
      <DataTable
        rows={players}
        getRowKey={(player) => player.id}
        columns={[
          {
            key: "identity",
            header: "Player",
            render: (player) => (
              <div>
                <p className="font-semibold text-[var(--color-text-strong)]">
                  #{player.squadNumber} {player.fullName}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  {player.primaryPosition}
                  {player.secondaryPosition ? ` / ${player.secondaryPosition}` : ""}
                </p>
              </div>
            ),
          },
          {
            key: "unit",
            header: "Unit",
            render: (player) => (
              <div>
                <p>{player.positionGroup}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{player.preferredFoot} foot</p>
              </div>
            ),
          },
          {
            key: "age",
            header: "Age",
            render: (player) => <span>{player.age}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (player) => <StatusBadge label={player.status.toLowerCase()} tone={getStatusTone(player.status)} />,
          },
          {
            key: "readiness",
            header: "Readiness",
            render: (player) => (
              <div>
                <p className="font-semibold">{player.readiness}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Weekly indicator</p>
              </div>
            ),
          },
        ]}
      />
    </SectionCard>
  </div>
);
