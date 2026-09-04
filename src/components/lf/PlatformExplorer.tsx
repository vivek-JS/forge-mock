import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { CATEGORIES, PLATFORMS } from "@/lib/logforge";
import { ButtonBase, Panel, Pill } from "./primitives";
import { cn } from "@/lib/utils";

export function PlatformExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const list = useMemo(
    () =>
      PLATFORMS.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.name.toLowerCase().includes(q.toLowerCase()) || p.kind.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search platforms…"
            aria-label="Search platforms"
            className="w-full rounded-md border border-input bg-surface/70 py-2 pl-9 pr-3 font-mono text-[0.8rem] outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-md border px-2.5 py-1.5 font-mono text-[0.72rem] transition-all",
                cat === c
                  ? "border-primary/45 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/35 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="font-mono text-[0.8rem] text-muted-foreground">no platforms match “{q}”</p>
          <ButtonBase variant="outline" className="mt-4" onClick={() => { setQ(""); setCat("All"); }}>
            Reset filters
          </ButtonBase>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.32, delay: Math.min(i * 0.03, 0.24) }}
            >
              <Panel className="group relative h-full overflow-hidden p-4 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[0.95rem] font-medium">{p.name}</h3>
                    <p className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{p.kind}</p>
                  </div>
                  <span className="grid size-8 place-items-center rounded border border-border bg-surface-2/60 font-mono text-[0.7rem] text-primary">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <dl className="mt-4 space-y-1.5 font-mono text-[0.72rem]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">endpoints</dt>
                    <dd>{p.endpoints}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">auth</dt>
                    <dd className="truncate text-right text-foreground/80">{p.auth}</dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone={p.mock ? "success" : "muted"}>mock {p.mock ? "ready" : "soon"}</Pill>
                  <Pill tone={p.liveLab ? "info" : "muted"}>live lab {p.liveLab ? "on" : "off"}</Pill>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full border-t border-border bg-surface-2/95 p-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ButtonBase variant="primary" className="w-full">
                    Create Environment
                  </ButtonBase>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      )}

      <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
        Prototype catalogue — vendor names shown as demo data only
      </p>
    </div>
  );
}
