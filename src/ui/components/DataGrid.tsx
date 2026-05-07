import { TABLE_SINGULAR, COLUMN_DISPLAY } from "../labels.ts";
import type { TableConfig, Row } from "../types.ts";

interface Props {
  config: TableConfig;
  rows: Row[];
  fkLabels: Record<string, Record<string | number, string>>;
  onEdit:   (row: Row) => void;
  onDelete: (row: Row) => void;
}

function colHeader(col: string, config: TableConfig): string {
  const fk = config.fks.find((f) => f.column === col);
  if (fk) return TABLE_SINGULAR[fk.refTable] ?? fk.refTable;
  return COLUMN_DISPLAY[col] ?? col;
}

export function DataGrid({ config, rows, fkLabels, onEdit, onDelete }: Props) {
  const visibleCols = config.columns
    .filter((c) => c.name !== config.pk)
    .map((c) => c.name);

  return (
    <table className="w-full text-sm">
      <thead className="sticky-header">
        <tr>
          {visibleCols.map((col) => (
            <th
              key={col}
              className="text-left px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em] bg-slate-50 border-b border-slate-200/80 whitespace-nowrap first:pl-7"
            >
              {colHeader(col, config)}
            </th>
          ))}
          <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em] bg-slate-50 border-b border-slate-200/80 w-28 text-right last:pr-7" />
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td
              colSpan={visibleCols.length + 1}
              className="px-6 py-20 text-center"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-slate-300 text-2xl">&#9671;</span>
                <span className="text-slate-400 text-sm">No records found.</span>
              </div>
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr
            key={String(row[config.pk])}
            className="border-b border-slate-100 hover:bg-indigo-50/40 transition-colors duration-100 group"
          >
            {visibleCols.map((col) => (
              <td key={col} className="px-6 py-3.5 text-slate-600 align-middle first:pl-7">
                {renderCell(row, col, config, fkLabels)}
              </td>
            ))}
            <td className="px-6 py-3.5 align-middle text-right last:pr-7">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  onClick={() => onEdit(row)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium border border-transparent rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                  onClick={() => onDelete(row)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function formatDate(val: string): string {
  if (!ISO_DATE_RE.test(val)) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function renderCell(
  row: Row,
  col: string,
  config: TableConfig,
  fkLabels: Record<string, Record<string | number, string>>,
) {
  const val = row[col];
  const fk = config.fks.find((f) => f.column === col);
  if (fk && fkLabels[col]) {
    const label = fkLabels[col][String(val)];
    return (
      <span title={String(val ?? "")} className="text-slate-700 font-medium">
        {label ?? String(val ?? "—")}
      </span>
    );
  }
  if (val === null || val === undefined) return <span className="text-slate-300">{"—"}</span>;
  const str = String(val);
  const formatted = formatDate(str);
  return <span className="text-slate-600">{formatted}</span>;
}
