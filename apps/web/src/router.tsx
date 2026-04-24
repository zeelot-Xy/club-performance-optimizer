import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { DashboardPage } from "./pages/dashboard-page";
import { MatchWeeksPage } from "./pages/match-weeks-page";
import { NotFoundPage } from "./pages/not-found-page";
import { PlayersPage } from "./pages/players-page";
import { RecommendationsPage } from "./pages/recommendations-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
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
]);
