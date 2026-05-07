import type { FKRef } from "../types.ts";

interface Props {
  name: string;
  value: unknown;
  fk?: FKRef;
  fkOptions?: { value: string | number; label: string }[];
  onChange: (name: string, value: unknown) => void;
}

const inputCls = [
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700",
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400",
  "transition-all placeholder:text-slate-400 hover:border-slate-300",
].join(" ");

export function FieldInput({ name, value, fk, fkOptions, onChange }: Props) {
  const strVal = value != null ? String(value) : "";

  if (fk && fkOptions) {
    return (
      <select
        className={inputCls + " cursor-pointer"}
        value={strVal}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(name, raw === "" ? null : isNaN(Number(raw)) ? raw : Number(raw));
        }}
      >
        <option value="">{"—"} select {"—"}</option>
        {fkOptions.map((opt) => (
          <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      className={inputCls}
      value={strVal}
      onChange={(e) => onChange(name, e.target.value || null)}
    />
  );
}
