import { useState } from "react";

import type { MatchWeekCreateInput, MatchWeekStatus } from "../../types/ui";

type MatchWeekFormProps = {
  onSubmit: (payload: MatchWeekCreateInput) => Promise<void>;
  isSubmitting: boolean;
};

const matchWeekStatuses: MatchWeekStatus[] = ["DRAFT", "READY", "COMPLETED"];

export const MatchWeekForm = ({ onSubmit, isSubmitting }: MatchWeekFormProps) => {
  const [form, setForm] = useState<MatchWeekCreateInput>({
    label: "",
    opponentName: "",
    matchDate: "",
    status: "DRAFT",
    notes: "",
  });

  const updateField = <K extends keyof MatchWeekCreateInput>(key: K, value: MatchWeekCreateInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          ...form,
          opponentName: form.opponentName?.trim() ? form.opponentName : null,
          notes: form.notes?.trim() ? form.notes : null,
        });
        setForm({
          label: "",
          opponentName: "",
          matchDate: "",
          status: "DRAFT",
          notes: "",
        });
      }}
    >
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Label</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.label} onChange={(e) => updateField("label", e.target.value)} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Opponent</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.opponentName ?? ""} onChange={(e) => updateField("opponentName", e.target.value)} />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Match date</span>
        <input className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" type="date" value={form.matchDate} onChange={(e) => updateField("matchDate", e.target.value)} required />
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)]">
        <span>Status</span>
        <select className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.status} onChange={(e) => updateField("status", e.target.value as MatchWeekStatus)}>
          {matchWeekStatuses.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm text-[var(--color-text-muted)] md:col-span-2">
        <span>Coach notes</span>
        <textarea className="min-h-28 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-strong)]" value={form.notes ?? ""} onChange={(e) => updateField("notes", e.target.value)} />
      </label>
      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-surface)] disabled:opacity-70">
          {isSubmitting ? "Saving match week..." : "Create match week"}
        </button>
      </div>
    </form>
  );
};
