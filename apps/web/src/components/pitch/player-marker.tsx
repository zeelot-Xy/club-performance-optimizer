type PlayerMarkerProps = {
  playerId: string;
  name: string;
  number: number;
  roleLabel: string;
  onClick?: (playerId: string) => void;
};

export const PlayerMarker = ({ playerId, name, number, roleLabel, onClick }: PlayerMarkerProps) => {
  const clickable = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={() => onClick?.(playerId)}
      disabled={!clickable}
      className="flex flex-col items-center text-center disabled:cursor-default"
      aria-label={clickable ? `Open details for ${name}` : `${name} marker`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(248,250,247,0.22)] bg-[rgba(248,250,247,0.12)] text-sm font-semibold text-white shadow-[0_14px_28px_rgba(7,23,17,0.22)] backdrop-blur transition hover:bg-[rgba(248,250,247,0.18)]">
        {number}
      </div>
      <p className="mt-2 max-w-[6.5rem] text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(248,250,247,0.94)]">
        {roleLabel}
      </p>
      <p className="mt-1 max-w-[7rem] text-xs leading-5 text-[rgba(248,250,247,0.78)]">{name}</p>
    </button>
  );
};
