import { useMemo, useState } from "react";
import { ArrowRight, Building2, RefreshCw, Search } from "lucide-react";

import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import { SectionCard } from "../components/ui/section-card";
import { StatusBadge } from "../components/ui/status-badge";
import { useClubs } from "../hooks/use-clubs";

export const ClubSetupPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clubsQuery, searchQuery, importClub, activateClub } = useClubs(searchTerm);

  const importedClubs = useMemo(() => clubsQuery.data ?? [], [clubsQuery.data]);
  const searchResults = useMemo(() => searchQuery.data ?? [], [searchQuery.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Club Setup"
        title="Select one club workspace at a time"
        description="Import a real club, activate it, and then continue with fairer, readiness-aware, and performance-focused weekly recommendation work."
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Search and import a club"
          description="Search public football club data, import the squad into your local workspace, and make that club active for planning."
        >
          <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <span>Club search</span>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for a club, for example Arsenal or Enyimba"
                className="w-full bg-transparent text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </label>

          <div className="mt-5 space-y-3">
            {searchQuery.isLoading ? <LoadingState title="Searching clubs" description="Looking up available club records from the configured provider." /> : null}
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
            {!searchQuery.isLoading && !searchQuery.isError && searchTerm.trim().length >= 2 && !searchResults.length ? (
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
                    <p className="text-lg font-semibold text-[var(--color-text-strong)]">{club.name}</p>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {[club.country, club.competition, club.provider].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      importClub.mutate({
                        provider: club.provider,
                        externalClubId: club.externalClubId,
                      })
                    }
                    disabled={importClub.isPending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {importClub.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Import and activate
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Imported club workspaces"
          description="Any club already imported into the local database can be activated here without repeating the import step."
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
                    <div>
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-[var(--color-text-strong)]" />
                        <p className="text-lg font-semibold text-[var(--color-text-strong)]">{club.name}</p>
                        {club.isActive ? <StatusBadge label="active" tone="success" /> : null}
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {[club.country, club.competition, club.provider].filter(Boolean).join(" | ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => activateClub.mutate(club.id)}
                      disabled={club.isActive || activateClub.isPending}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activateClub.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
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
