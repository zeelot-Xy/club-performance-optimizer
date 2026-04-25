import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { PlayerForm } from "../components/forms/player-form";
import { PlayerStatsModal } from "../components/players/player-stats-modal";
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const { data, isLoading, isError, error, createPlayer } = usePlayers();

  const players = useMemo(() => (data ?? []).map(mapApiPlayerToRecord), [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Squad Overview"
        title="Manage the active club squad in one controlled workspace"
        description="Review registered players, add new squad members, and keep the weekly selection pool accurate for fair and explainable recommendation runs."
        actions={
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text-muted)]">
              <Search className="h-4 w-4" />
              Squad register
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
        description="Add a squad member with the core profile details needed for weekly planning and recommendation eligibility."
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
                    : "The player details could not be saved."
                }
              />
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      <SectionCard
        title="Registered Squad"
        description="This register shows the active club squad and the main profile details used across the planning workflow."
      >
        {isLoading ? <LoadingState title="Loading players" /> : null}
        {isError ? (
          <ErrorState
            title="Players could not be loaded"
            description={error instanceof Error ? error.message : "The player register is not available right now."}
          />
        ) : null}
        {!isLoading && !isError && !players.length ? (
          <EmptyState
            title="No players registered yet"
            description="Add the first squad member from this page to begin building the player pool for weekly recommendations."
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
                  <button
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    className="text-left transition hover:opacity-80"
                  >
                    <p className="font-semibold text-[var(--color-text-strong)]">
                      #{player.squadNumber} {player.fullName}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      {player.primaryPosition}
                      {player.secondaryPosition ? ` / ${player.secondaryPosition}` : ""}
                    </p>
                  </button>
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

      <PlayerStatsModal
        playerId={selectedPlayerId}
        isOpen={Boolean(selectedPlayerId)}
        onClose={() => setSelectedPlayerId(null)}
      />
    </div>
  );
};
