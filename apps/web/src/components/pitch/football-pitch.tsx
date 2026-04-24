import type { LineupPlayer, RecommendationRecord } from "../../types/ui";
import { PlayerMarker } from "./player-marker";

const baseRowsByFormation: Record<RecommendationRecord["formation"], number[]> = {
  "4-3-3": [3, 3, 4],
  "4-4-2": [2, 4, 4],
  "4-2-3-1": [1, 3, 2, 4],
  "3-5-2": [2, 5, 3],
};

type FootballPitchProps = {
  formation: RecommendationRecord["formation"];
  lineup: LineupPlayer[];
};

const splitRows = (formation: RecommendationRecord["formation"], lineup: LineupPlayer[]) => {
  const goalkeeper = lineup.find((player) => player.positionGroup === "GOALKEEPER");
  const outfield = lineup.filter((player) => player.positionGroup !== "GOALKEEPER");
  const rowSizes = baseRowsByFormation[formation];
  const rows: LineupPlayer[][] = [];
  let cursor = 0;

  rowSizes.forEach((size) => {
    rows.push(outfield.slice(cursor, cursor + size));
    cursor += size;
  });

  if (cursor < outfield.length && rows.length > 0) {
    rows[rows.length - 1] = [...rows[rows.length - 1], ...outfield.slice(cursor)];
  }

  return { goalkeeper, rows };
};

export const FootballPitch = ({ formation, lineup }: FootballPitchProps) => {
  const { goalkeeper, rows } = splitRows(formation, lineup);

  return (
    <div className="pitch-surface relative overflow-hidden rounded-[2rem] border border-[rgba(248,250,247,0.12)] p-5 text-white shadow-[0_28px_90px_rgba(7,23,17,0.26)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,250,247,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-[6%] rounded-[1.75rem] border border-[rgba(248,250,247,0.18)]" />
      <div className="pointer-events-none absolute inset-x-[20%] top-[16%] h-[22%] rounded-b-[1.5rem] border border-t-0 border-[rgba(248,250,247,0.18)]" />
      <div className="pointer-events-none absolute inset-x-[20%] bottom-[16%] h-[22%] rounded-t-[1.5rem] border border-b-0 border-[rgba(248,250,247,0.18)]" />
      <div className="pointer-events-none absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-[rgba(248,250,247,0.18)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(248,250,247,0.18)]" />

      <div className="relative flex min-h-[560px] flex-col justify-between gap-8 py-6 sm:min-h-[620px]">
        {rows.map((row, index) => (
          <div key={`row-${index}`} className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {row.map((player) => (
              <PlayerMarker
                key={player.id}
                name={player.fullName}
                number={player.squadNumber}
                roleLabel={player.positionLabel}
              />
            ))}
          </div>
        ))}
        {goalkeeper ? (
          <div className="flex justify-center">
            <PlayerMarker
              name={goalkeeper.fullName}
              number={goalkeeper.squadNumber}
              roleLabel={goalkeeper.positionLabel}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
