import { Activity, BrainCircuit, Database, ShieldCheck } from "lucide-react";

const cards = [
  {
    title: "Frontend",
    description: "React 18 + Vite + TypeScript starter ready for the Coach/Admin dashboard.",
    icon: Activity,
  },
  {
    title: "Backend API",
    description: "Express orchestration layer prepared to own auth, data validation, and recommendation services.",
    icon: ShieldCheck,
  },
  {
    title: "AI Service",
    description: "FastAPI support service isolated for optional prediction enhancement later.",
    icon: BrainCircuit,
  },
  {
    title: "PostgreSQL",
    description: "Docker Compose provisions the database as the single source of truth for system data.",
    icon: Database,
  },
];

export const App = () => {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] text-[var(--color-primary)]">
      <div className="grid-background min-h-screen">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-[rgba(15,44,34,0.12)] bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,44,34,0.10)] backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-[rgba(15,44,34,0.65)]">
              Phase 4 Local Environment
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Club Performance and Formation Optimizer
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[rgba(15,44,34,0.76)] sm:text-lg">
              The local development baseline is now prepared for the single-club, weekly,
              explainable decision-support system. This starter keeps the visual direction calm,
              tactical, and premium using the locked deep relic green theme.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[1.75rem] border border-[rgba(15,44,34,0.12)] bg-white/88 p-6 shadow-[0_18px_50px_rgba(15,44,34,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,44,34,0.08)] text-[var(--color-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(15,44,34,0.72)]">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[1.75rem] border border-[rgba(15,44,34,0.12)] bg-white/88 p-6 shadow-[0_18px_50px_rgba(15,44,34,0.08)]">
              <h2 className="text-xl font-semibold">Boot Targets</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[rgba(15,44,34,0.74)]">
                <li>Frontend: <span className="font-medium">http://localhost:5173</span></li>
                <li>Backend API: <span className="font-medium">http://localhost:8000</span></li>
                <li>AI service: <span className="font-medium">http://localhost:8001</span></li>
                <li>Database: <span className="font-medium">localhost:5432</span></li>
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-[rgba(15,44,34,0.12)] bg-[var(--color-primary)] p-6 text-[var(--color-surface)] shadow-[0_18px_50px_rgba(15,44,34,0.18)]">
              <h2 className="text-xl font-semibold">Next Focus</h2>
              <p className="mt-4 text-sm leading-6 text-[rgba(248,250,247,0.82)]">
                Phase 5 will define the real Prisma schema and database models on top of this environment
                baseline. For now, the stack is intentionally lightweight, explainable, and ready to boot.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
