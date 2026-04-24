import { BarChart3, CalendarRange, LayoutDashboard, ShieldQuestion, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/players", label: "Players", icon: Users },
  { to: "/match-weeks", label: "Match Weeks", icon: CalendarRange },
  { to: "/recommendations", label: "Recommendations", icon: BarChart3 },
];

export const Sidebar = () => (
  <aside className="rounded-[2rem] border border-[rgba(248,250,247,0.1)] bg-[linear-gradient(180deg,rgba(7,23,17,0.94),rgba(15,44,34,0.98))] p-5 text-[var(--color-surface)] shadow-[0_32px_90px_rgba(7,23,17,0.28)]">
    <div className="rounded-[1.75rem] border border-[rgba(248,250,247,0.08)] bg-[rgba(248,250,247,0.05)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[rgba(248,250,247,0.58)]">Coach Console</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">Club Performance Optimizer</h2>
      <p className="mt-3 text-sm leading-6 text-[rgba(248,250,247,0.72)]">
        One-club, weekly decision support with explainable formation and lineup recommendations.
      </p>
    </div>

    <nav className="mt-8 space-y-2">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-[rgba(248,250,247,0.12)] text-white shadow-[inset_0_0_0_1px_rgba(248,250,247,0.08)]"
                : "text-[rgba(248,250,247,0.72)] hover:bg-[rgba(248,250,247,0.06)] hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>

    <div className="mt-8 rounded-[1.5rem] border border-[rgba(248,250,247,0.08)] bg-[rgba(248,250,247,0.05)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(248,250,247,0.12)]">
          <ShieldQuestion className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Explainability First</p>
          <p className="text-xs text-[rgba(248,250,247,0.65)]">Rule-based logic stays primary.</p>
        </div>
      </div>
    </div>
  </aside>
);
