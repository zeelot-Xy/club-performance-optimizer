import { Outlet } from "react-router-dom";

import { AppShell } from "./layouts/app-shell";

export const App = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);
