import { PageHeader } from "../components/ui/page-header";
import { ClubWorkspaceManager } from "../components/layout/club-workspace-manager";

export const ClubSetupPage = () => (
  <div className="space-y-6">
    <PageHeader
      eyebrow="Club Setup"
      title="Select one club workspace at a time"
      description="Import a real club, activate it, and then continue with fairer, readiness-aware, and performance-focused weekly recommendation work."
    />

    <ClubWorkspaceManager />
  </div>
);
