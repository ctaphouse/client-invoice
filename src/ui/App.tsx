import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar.tsx";
import { TablePage } from "./components/TablePage.tsx";
import type { TableConfig } from "./types.ts";

const TABLE_ORDER = [
  "clients","lineItems","expenseItems","projects","departments",
  "rates","vendors","companies",
];

export function App() {
  const [configs, setConfigs]   = useState<TableConfig[]>([]);
  const [current, setCurrent]   = useState<string>(
    window.location.hash.replace("#", "") || "clients"
  );

  useEffect(() => {
    Promise.all(
      TABLE_ORDER.map((r) => fetch(`/api/${r}/schema`).then((res) => res.json() as Promise<TableConfig>))
    ).then(setConfigs);
  }, []);

  function navigate(route: string) {
    setCurrent(route);
    window.location.hash = route;
  }

  useEffect(() => {
    function onHash() {
      const r = window.location.hash.replace("#", "");
      if (r) setCurrent(r);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <Sidebar configs={configs} current={current} onSelect={navigate} />
      <main className="flex-1 overflow-hidden flex flex-col bg-slate-100">
        <TablePage key={current} apiRoute={current} />
      </main>
    </>
  );
}
