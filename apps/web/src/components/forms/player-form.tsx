import { useState } from "react";

import type { PlayerCreateInput, PlayerStatus, PositionGroup, PreferredFoot } from "../../types/ui";

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
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Squad number</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" type="number" min={1} value={form.squadNumber || ""} onChange={(e) => updateField("squadNumber", Number(e.target.value))} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Primary position</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.primaryPosition} onChange={(e) => updateField("primaryPosition", e.target.value)} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Secondary position</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.secondaryPosition ?? ""} onChange={(e) => updateField("secondaryPosition", e.target.value)} />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Position group</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.positionGroup} onChange={(e) => updateField("positionGroup", e.target.value as PositionGroup)}>
          {positionGroups.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Preferred foot</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.preferredFoot} onChange={(e) => updateField("preferredFoot", e.target.value as PreferredFoot)}>
          {preferredFeet.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Age</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" type="number" min={16} value={form.age || ""} onChange={(e) => updateField("age", Number(e.target.value))} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Height (cm)</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" type="number" min={120} value={form.heightCm ?? ""} onChange={(e) => updateField("heightCm", e.target.value ? Number(e.target.value) : null)} />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Status</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.status} onChange={(e) => updateField("status", e.target.value as PlayerStatus)}>
          {playerStatuses.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-surface)] disabled:opacity-70">
          {isSubmitting ? "Saving player..." : "Create player"}
        </button>
      </div>
    </form>
  );
};
