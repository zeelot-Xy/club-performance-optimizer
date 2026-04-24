import type { PropsWithChildren } from "react";

import { Sidebar } from "../components/layout/sidebar";
import { Topbar } from "../components/layout/topbar";

export const AppShell = ({ children }: PropsWithChildren) => (
  <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-strong)]">
    <div className="grid-background min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <Sidebar />
        <div className="flex min-w-0 flex-col gap-6">
          <Topbar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  </main>
);
