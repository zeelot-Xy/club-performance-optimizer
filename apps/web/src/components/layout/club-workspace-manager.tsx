import { useMemo, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, RefreshCw, Search, ShieldAlert } from "lucide-react";

import { useClubs } from "../../hooks/use-clubs";
import { EmptyState } from "../ui/empty-state";
import { ErrorState } from "../ui/error-state";
import { LoadingState } from "../ui/loading-state";
import { SectionCard } from "../ui/section-card";
import { StatusBadge } from "../ui/status-badge";

type ClubWorkspaceManagerProps = {
  mode?: "page" | "panel";
  onComplete?: () => void;
};

export const ClubWorkspaceManager = ({
  mode = "page",
  onComplete,
}: ClubWorkspaceManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [latestImportFeedback, setLatestImportFeedback] = useState<{
    clubName: string;
    diagnostics: string[];
    summary: {
      playerCount: number;
      importedMatchCount: number;
      importedPlayerStatCount: number;
      baselineWeeklyCount: number;
    };
  } | null>(null);

  const { clubsQuery, currentClubQuery, searchQuery, importClub, activateClub } = useClubs(searchTerm);

  const importedClubs = useMemo(() => clubsQuery.data ?? [], [clubsQuery.data]);
  const searchResults = useMemo(() => searchQuery.data ?? [], [searchQuery.data]);
  const activeClub = currentClubQuery.data;
  const compact = mode === "panel";

  return (
    <div className={`space-y-5 ${compact ? "" : "space-y-6"}`}>
      {latestImportFeedback ? (
        <div className="rounded-[1.5rem] border border-[rgba(37,99,235,0.14)] bg-[rgba(15,44,34,0.04)] p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--color-success)]" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                {latestImportFeedback.clubName} was imported into the workspace
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Imported {latestImportFeedback.summary.playerCount} players,{" "}
                {latestImportFeedback.summary.importedMatchCount} recent matches, and{" "}
                {latestImportFeedback.summary.baselineWeeklyCount} baseline weekly records so
                recommendation generation can start immediately.
              </p>
              {latestImportFeedback.diagnostics.length ? (
                <div className="mt-3 rounded-2xl border border-[rgba(245,158,11,0.18)] bg-[rgba(245,158,11,0.08)] p-3 text-sm text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-2 font-medium text-[var(--color-text-strong)]">
                    <ShieldAlert className="h-4 w-4 text-[var(--color-warning)]" />
                    Import completeness note
                  </div>
                  <ul className="mt-2 space-y-1">
                    {latestImportFeedback.diagnostics.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className={`grid gap-5 ${compact ? "" : "xl:grid-cols-[1.05fr_0.95fr]"}`}>
        <SectionCard
          title={compact ? "Import another club" : "Search and import a club"}
          description={
            compact
              ? "Search public football data, import another club, and activate it without leaving the main workspace."
              : "Search public football club data, import the squad and recent context into your local workspace, and make that club active for planning."
          }
        >
          <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <span>Club search</span>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for a club, for example Manchester United or Arsenal"
                className="w-full bg-transparent text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </label>

          <div className="mt-5 space-y-3">
            {searchQuery.isLoading ? (
              <LoadingState
                title="Searching clubs"
                description="Looking up available club records from the configured provider."
              />
            ) : null}
            {searchQuery.isError ? (
              <ErrorState
                title="Club search is unavailable"
                description={
                  searchQuery.error instanceof Error
                    ? searchQuery.error.message
                    : "Club search could not be completed right now."
                }
              />
            ) : null}
            {!searchQuery.isLoading &&
            !searchQuery.isError &&
            searchTerm.trim().length >= 2 &&
            !searchResults.length ? (
              <EmptyState
                title="No clubs matched that search"
                description="Try a different club name, or confirm that the football provider is configured."
              />
            ) : null}
            {searchResults.map((club) => (
              <article
                key={`${club.provider}:${club.externalClubId}`}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/72 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-[var(--color-text-strong)]">
                      {club.name}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {[club.country, club.competition, club.provider].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      importClub.mutate(
                        {
                          provider: club.provider,
                          externalClubId: club.externalClubId,
                        },
                        {
                          onSuccess: (result) => {
                            setLatestImportFeedback({
                              clubName: result.club.name,
                              diagnostics: result.providerDiagnostics,
                              summary: result.importSummary,
                            });
                            onComplete?.();
                          },
                        },
                      )
                    }
                    disabled={importClub.isPending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {importClub.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Import and activate
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Imported club workspaces"
          description="Any previously imported club can be reactivated here. One club stays active at a time, but switching remains available throughout the app."
        >
          {clubsQuery.isLoading ? <LoadingState title="Loading imported clubs" /> : null}
          {clubsQuery.isError ? (
            <ErrorState
              title="Imported clubs could not be loaded"
              description={
                clubsQuery.error instanceof Error
                  ? clubsQuery.error.message
                  : "The local club workspace list is unavailable."
              }
            />
          ) : null}
          {!clubsQuery.isLoading && !clubsQuery.isError && !importedClubs.length ? (
            <EmptyState
              title="No club has been imported yet"
              description="Use the search panel to import a club and create the first active workspace."
            />
          ) : null}
          {!clubsQuery.isLoading && !clubsQuery.isError && importedClubs.length ? (
            <div className="space-y-3">
              {importedClubs.map((club) => (
                <article
                  key={club.id}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/72 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-[var(--color-text-strong)]" />
                        <p className="truncate text-lg font-semibold text-[var(--color-text-strong)]">
                          {club.name}
                        </p>
                        {club.isActive ? <StatusBadge label="active" tone="success" /> : null}
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {[club.country, club.competition, club.provider].filter(Boolean).join(" | ")}
                      </p>
                      <p className="mt-3 text-xs leading-6 text-[var(--color-text-muted)]">
                        {club.importSummary.playerCount} players | {club.importSummary.importedMatchCount} recent matches | {club.importSummary.baselineWeeklyCount} baseline weekly records
                      </p>
                      {club.isActive && activeClub ? (
                        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                          This is the current active club workspace.
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        activateClub.mutate(club.id, {
                          onSuccess: () => {
                            onComplete?.();
                          },
                        })
                      }
                      disabled={club.isActive || activateClub.isPending}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activateClub.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      {club.isActive ? "Active workspace" : "Activate"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
};
