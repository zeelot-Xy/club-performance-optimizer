import { Navigate, Outlet, createBrowserRouter, useLocation } from "react-router-dom";

import { App } from "./App";
import { LoadingState } from "./components/ui/loading-state";
import { useAuth } from "./hooks/use-auth";
import { useClubs } from "./hooks/use-clubs";
import { ClubSetupPage } from "./pages/club-setup-page";
import { DashboardPage } from "./pages/dashboard-page";
import { LoginPage } from "./pages/login-page";
import { MatchWeeksPage } from "./pages/match-weeks-page";
import { NotFoundPage } from "./pages/not-found-page";
import { PlayersPage } from "./pages/players-page";
import { RecommendationsPage } from "./pages/recommendations-page";

const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingState title="Restoring session" description="Checking your Coach/Admin session before opening the workspace." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const RequireActiveClub = () => {
  const { currentClubQuery } = useClubs();

  if (currentClubQuery.isLoading) {
    return (
      <div className="p-6">
        <LoadingState
          title="Opening club workspace"
          description="Checking which club is active before loading the planning screens."
        />
      </div>
    );
  }

  if (!currentClubQuery.data) {
    return <Navigate to="/club-setup" replace />;
  }

  return <Outlet />;
};

const RequireNoActiveClub = () => {
  const { currentClubQuery } = useClubs();

  if (currentClubQuery.isLoading) {
    return (
      <div className="p-6">
        <LoadingState
          title="Checking workspace state"
          description="Confirming whether a club is already active for this session."
        />
      </div>
    );
  }

  if (currentClubQuery.data) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
          {
            path: "club-setup",
            element: <RequireNoActiveClub />,
            children: [{ index: true, element: <ClubSetupPage /> }],
          },
          {
            element: <RequireActiveClub />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "players",
                element: <PlayersPage />,
              },
              {
                path: "match-weeks",
                element: <MatchWeeksPage />,
              },
              {
                path: "recommendations",
                element: <RecommendationsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
