import { useState } from "react";

import type { PlayerCreateInput, PlayerStatus, PositionGroup, PreferredFoot } from "../../types/ui";
import { toTitleCase } from "../../lib/formatters";

type PlayerFormProps = {
  onSubmit: (payload: PlayerCreateInput) => Promise<void>;
  isSubmitting: boolean;
};

const positionGroups: PositionGroup[] = ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"];
const preferredFeet: PreferredFoot[] = ["LEFT", "RIGHT", "BOTH", "UNKNOWN"];
const playerStatuses: PlayerStatus[] = ["ACTIVE", "INACTIVE", "INJURED"];

export const PlayerForm = ({ onSubmit, isSubmitting }: PlayerFormProps) => {
  const [form, setForm] = useState<PlayerCreateInput>({
    fullName: "",
    squadNumber: 0,
    primaryPosition: "",
    secondaryPosition: "",
    positionGroup: "DEFENDER",
    preferredFoot: "RIGHT",
    age: 20,
    heightCm: null,
    status: "ACTIVE",
  });

  const updateField = <K extends keyof PlayerCreateInput>(key: K, value: PlayerCreateInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          ...form,
          secondaryPosition: form.secondaryPosition?.trim() ? form.secondaryPosition : null,
          heightCm: form.heightCm ? Number(form.heightCm) : null,
        });
        setForm({
          fullName: "",
          squadNumber: 0,
          primaryPosition: "",
          secondaryPosition: "",
          positionGroup: "DEFENDER",
          preferredFoot: "RIGHT",
          age: 20,
          heightCm: null,
          status: "ACTIVE",
        });
      }}
    >
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Full name</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          placeholder="e.g. Samuel Okafor"
          required
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Enter the player's full registered name.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Squad number</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          type="number"
          min={1}
          value={form.squadNumber || ""}
          onChange={(e) => updateField("squadNumber", Number(e.target.value))}
          placeholder="e.g. 9"
          required
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Use the player's shirt number within the squad.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Primary position</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          value={form.primaryPosition}
          onChange={(e) => updateField("primaryPosition", e.target.value)}
          placeholder="e.g. Centre Forward"
          required
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Use the player's main on-pitch role.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Secondary position</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          value={form.secondaryPosition ?? ""}
          onChange={(e) => updateField("secondaryPosition", e.target.value)}
          placeholder="Optional"
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Add an alternative role only if it is tactically realistic.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Position group</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.positionGroup} onChange={(e) => updateField("positionGroup", e.target.value as PositionGroup)}>
          {positionGroups.map((option) => (
            <option key={option} value={option}>{toTitleCase(option)}</option>
          ))}
        </select>
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">This helps the recommendation engine balance the lineup by unit.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Preferred foot</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.preferredFoot} onChange={(e) => updateField("preferredFoot", e.target.value as PreferredFoot)}>
          {preferredFeet.map((option) => (
            <option key={option} value={option}>{toTitleCase(option)}</option>
          ))}
        </select>
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Preferred foot supports realistic role and formation fit.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Age</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          type="number"
          min={16}
          value={form.age || ""}
          onChange={(e) => updateField("age", Number(e.target.value))}
          placeholder="e.g. 24"
          required
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Record the player's current football age.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Height (cm)</span>
        <input
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]"
          type="number"
          min={120}
          value={form.heightCm ?? ""}
          onChange={(e) => updateField("heightCm", e.target.value ? Number(e.target.value) : null)}
          placeholder="Optional"
        />
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Height is optional but useful for squad profiling.</p>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Status</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.status} onChange={(e) => updateField("status", e.target.value as PlayerStatus)}>
          {playerStatuses.map((option) => (
            <option key={option} value={option}>{toTitleCase(option)}</option>
          ))}
        </select>
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">Use injured or inactive only when the player should not be treated as fully available.</p>
      </label>
      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-surface)] disabled:opacity-70">
          {isSubmitting ? "Saving player..." : "Save player profile"}
        </button>
      </div>
    </form>
  );
};
