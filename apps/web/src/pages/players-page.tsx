import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { PlayerForm } from "../components/forms/player-form";
import { DataTable } from "../components/ui/data-table";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { usePlayers } from "../hooks/use-players";
import { mapApiPlayerToRecord, playerStatusTone, toTitleCase } from "../lib/formatters";
import type { PlayerCreateInput } from "../types/ui";

export const PlayersPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data, isLoading, isError, error, createPlayer } = usePlayers();

  const players = useMemo(() => (data ?? []).map(mapApiPlayerToRecord), [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Squad Overview"
        title="A controlled one-club player view now connected to the backend"
        description="The players screen now reads from the real API and can also create new squad entries. Recommendation logic still remains entirely on the backend."
        actions={
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text-muted)]">
              <Search className="h-4 w-4" />
              Live API table
            </div>
            <button
              type="button"
              onClick={() => setShowCreateForm((current) => !current)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)]"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Hide form" : "Add player"}
            </button>
          </div>
        }
      />

      {showCreateForm ? (
        <SectionCard
          title="Create Player"
          description="This lightweight form posts directly to the backend players module and refreshes the table on success."
        >
          <PlayerForm
            isSubmitting={createPlayer.isPending}
            onSubmit={async (payload: PlayerCreateInput) => {
              await createPlayer.mutateAsync(payload);
              setShowCreateForm(false);
            }}
          />
          {createPlayer.isError ? (
            <div className="mt-4">
              <ErrorState
                title="Player creation failed"
                description={
                  createPlayer.error instanceof Error
                    ? createPlayer.error.message
                    : "The backend rejected the player payload."
                }
              />
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      <SectionCard
        title="Registered Squad"
        description="This table is now backed by the real players endpoint and stays aligned with the single-club project scope."
      >
        {isLoading ? <LoadingState title="Loading players" /> : null}
        {isError ? (
          <ErrorState
            title="Players could not be loaded"
            description={error instanceof Error ? error.message : "The players endpoint did not respond as expected."}
          />
        ) : null}
        {!isLoading && !isError && !players.length ? (
          <EmptyState
            title="No players registered yet"
            description="Create the first squad member from this page, then the rest of the dashboard will start reflecting live data."
          />
        ) : null}
        {!isLoading && !isError && players.length ? (
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
                    <p>{toTitleCase(player.positionGroup)}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {toTitleCase(player.preferredFoot)} foot
                    </p>
                  </div>
                ),
              },
              {
                key: "age",
                header: "Age / Height",
                render: (player) => (
                  <div>
                    <p>{player.age} years</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {data?.find((entry) => entry.id === player.id)?.heightCm
                        ? `${data.find((entry) => entry.id === player.id)?.heightCm} cm`
                        : "Height not set"}
                    </p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (player) => (
                  <StatusBadge
                    label={player.status.toLowerCase()}
                    tone={playerStatusTone(player.status)}
                  />
                ),
              },
            ]}
          />
        ) : null}
      </SectionCard>
    </div>
  );
};
