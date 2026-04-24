type PlayerMarkerProps = {
  name: string;
  number: number;
  roleLabel: string;
};

export const PlayerMarker = ({ name, number, roleLabel }: PlayerMarkerProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(248,250,247,0.22)] bg-[rgba(248,250,247,0.12)] text-sm font-semibold text-white shadow-[0_14px_28px_rgba(7,23,17,0.22)] backdrop-blur">
      {number}
    </div>
    <p className="mt-2 max-w-[6.5rem] text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(248,250,247,0.94)]">
      {roleLabel}
    </p>
    <p className="mt-1 max-w-[7rem] text-xs leading-5 text-[rgba(248,250,247,0.78)]">{name}</p>
  </div>
);
