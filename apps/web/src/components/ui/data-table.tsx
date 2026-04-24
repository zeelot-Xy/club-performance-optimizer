import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
};

export const DataTable = <T,>({ columns, rows, getRowKey }: DataTableProps<T>) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)]">
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-[rgba(15,44,34,0.05)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[rgba(255,255,255,0.8)]">
          {rows.map((row, rowIndex) => (
            <tr key={getRowKey(row)} className={rowIndex === rows.length - 1 ? "" : "border-b border-[rgba(15,44,34,0.08)]"}>
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-4 align-top text-sm text-[var(--color-text-strong)] ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
