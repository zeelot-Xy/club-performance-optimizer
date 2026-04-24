import { StatusBadge } from "../ui/status-badge";

const supportedFormations = ["4-3-3", "4-4-2", "4-2-3-1", "3-5-2"] as const;

type FormationSelectorProps = {
  activeFormation: string;
};

export const FormationSelector = ({ activeFormation }: FormationSelectorProps) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {supportedFormations.map((formation) => {
      const active = formation === activeFormation;

      return (
        <div
          key={formation}
          className={`rounded-[1.5rem] border p-4 ${
            active
              ? "border-[rgba(15,44,34,0.18)] bg-[rgba(15,44,34,0.1)]"
              : "border-[var(--color-border)] bg-[rgba(255,255,255,0.7)]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-[var(--color-text-strong)]">{formation}</p>
            <StatusBadge label={active ? "selected" : "supported"} tone={active ? "success" : "default"} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            {active
              ? "Chosen because it balanced midfield control, availability, and wide attacking coverage."
              : "Available within the controlled formation set for weekly recommendation evaluation."}
          </p>
        </div>
      );
    })}
  </div>
);
