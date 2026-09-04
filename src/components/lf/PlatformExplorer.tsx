import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, Search, Zap } from "lucide-react";
import { CATEGORIES, CATEGORY_TINT, PLATFORMS, type Platform } from "@/lib/logforge";
import { ButtonBase, Panel, Pill } from "./primitives";
import { cn } from "@/lib/utils";

type Live = { rps: number; p95: number; errors: number; spark: number[] };

function seedLive(p: Platform): Live {
  return {
    rps: p.baseRps,
    p95: 40 + (p.endpoints % 90),
    errors: (p.endpoints % 4) / 10,
    spark: Array.from({ length: 24 }, (_, i) => p.baseRps + Math.sin(i / 2.2) * 2),
  };
}

/** Simulated real-time telemetry across the whole catalogue. */
function useLiveTelemetry(paused: boolean) {
  const [live, setLive] = useState<Record<string, Live>>(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.id, seedLive(p)])),
  );
  const tick = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      tick.current += 1;
      setLive((prev) => {
        const next: Record<string, Live> = {};
        for (const p of PLATFORMS) {
          const cur = prev[p.id] ?? seedLive(p);
          const drift = (Math.random() - 0.45) * (p.baseRps * 0.35);
          const rps = Math.max(0.4, cur.rps * 0.72 + (p.baseRps + drift) * 0.28);
          next[p.id] = {
            rps,
            p95: Math.max(12, cur.p95 * 0.85 + (30 + Math.random() * 120) * 0.15),
            errors: Math.max(0, cur.errors * 0.8 + (Math.random() < 0.08 ? Math.random() * 2.4 : 0) * 0.2),
            spark: [...cur.spark.slice(1), rps],
          };
        }
        return next;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, [paused]);

  return live;
}

function Spark({ data, tint }: { data: number[]; tint: string }) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${28 - (v / max) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="h-7 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={tint} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function PlatformExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string>(PLATFORMS[0]!.id);
  const live = useLiveTelemetry(paused);

  const list = useMemo(
    () =>
      PLATFORMS.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.kind.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  const active = PLATFORMS.find((p) => p.id === selected) ?? PLATFORMS[0]!;
  const activeLive = live[active.id] ?? seedLive(active);
  const totalRps = Object.values(live).reduce((a, b) => a + b.rps, 0);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${PLATFORMS.length} platforms…`}
            aria-label="Search platforms"
            className="w-full rounded-md border border-input bg-surface/70 py-2 pl-9 pr-3 font-mono text-[0.8rem] outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/40 focus:border-primary/60"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 rounded-md border border-border bg-surface/60 px-2.5 py-1.5 font-mono text-[0.7rem] text-muted-foreground">
            <span className={cn("status-dot", !paused && "ping-soft")} style={{ background: "var(--cat-appsec)" }} />
            {totalRps.toFixed(0)} req/s across mocks
          </span>
          <button
            onClick={() => setPaused((v) => !v)}
            className="rounded-md border border-border px-2.5 py-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {paused ? "resume stream" : "pause stream"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Categories">
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
            style={c !== "All" && cat === c ? { borderColor: CATEGORY_TINT[c], color: CATEGORY_TINT[c] } : undefined}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border px-6 py-14 text-center">
          <p className="font-mono text-[0.8rem] text-muted-foreground">no platforms match “{q}”</p>
          <ButtonBase variant="outline" className="mt-4" onClick={() => { setQ(""); setCat("All"); }}>
            Reset filters
          </ButtonBase>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_20rem]">
          {/* periodic-table style live grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
            <AnimatePresence initial={false}>
              {list.map((p, i) => {
                const l = live[p.id] ?? seedLive(p);
                const tint = CATEGORY_TINT[p.category];
                const hot = l.rps > p.baseRps * 1.15;
                const failing = l.errors > 0.6;
                return (
                  <motion.button
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.22, delay: Math.min(i * 0.012, 0.2) }}
                    onClick={() => setSelected(p.id)}
                    onMouseEnter={() => setSelected(p.id)}
                    aria-pressed={selected === p.id}
                    title={`${p.name} — ${p.kind}`}
                    className={cn(
                      "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-md border p-2 text-left transition-all duration-200",
                      selected === p.id
                        ? "-translate-y-0.5 border-transparent"
                        : "border-border hover:-translate-y-0.5",
                    )}
                    style={{
                      background: `linear-gradient(160deg, color-mix(in oklab, ${tint} ${selected === p.id ? "18%" : "9%"}, var(--surface)), var(--surface))`,
                      borderColor: selected === p.id ? tint : undefined,
                      boxShadow: selected === p.id ? `0 10px 30px -18px ${tint}` : undefined,
                    }}
                  >
                    <span className="flex items-start justify-between gap-1">
                      <span
                        className="grid size-6 place-items-center rounded-sm font-mono text-[0.62rem] font-medium"
                        style={{ background: `color-mix(in oklab, ${tint} 22%, transparent)`, color: tint }}
                      >
                        {p.name.replace(/[^A-Za-z ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                      <span
                        className={cn("status-dot mt-1", !paused && "ping-soft")}
                        style={{ background: failing ? "var(--cat-secops)" : tint }}
                      />
                    </span>

                    <span className="block">
                      <span className="block truncate text-[0.72rem] font-medium leading-tight">{p.name}</span>
                      <span className="mt-0.5 flex items-center gap-1 font-mono text-[0.6rem] text-muted-foreground">
                        <motion.span key={Math.round(l.rps * 10)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} style={{ color: hot ? tint : undefined }}>
                          {l.rps.toFixed(1)}
                        </motion.span>
                        req/s
                      </span>
                      <span className="mt-1 block h-0.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: tint }}
                          animate={{ width: `${Math.min(100, (l.rps / (p.baseRps * 2)) * 100)}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* live inspector */}
          <Panel className="h-fit p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[0.95rem] font-medium">{active.name}</h3>
                <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {active.kind}
                </p>
              </div>
              <span
                className="rounded-sm px-2 py-1 font-mono text-[0.62rem]"
                style={{ background: `color-mix(in oklab, ${CATEGORY_TINT[active.category]} 18%, transparent)`, color: CATEGORY_TINT[active.category] }}
              >
                {active.category}
              </span>
            </div>

            <div className="mt-4">
              <Spark data={activeLive.spark} tint={CATEGORY_TINT[active.category]} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[0.72rem]">
              {[
                ["req/s", activeLive.rps.toFixed(1)],
                ["p95", `${activeLive.p95.toFixed(0)}ms`],
                ["error %", activeLive.errors.toFixed(2)],
                ["endpoints", String(active.endpoints)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md border border-border bg-surface-2/50 px-2.5 py-2">
                  <dt className="text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-3 font-mono text-[0.7rem] text-muted-foreground">
              auth · <span className="text-foreground/80">{active.auth}</span>
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill tone={active.mock ? "success" : "muted"}>mock {active.mock ? "ready" : "soon"}</Pill>
              <Pill tone={active.liveLab ? "info" : "muted"}>live lab {active.liveLab ? "on" : "off"}</Pill>
            </div>

            <ButtonBase variant="primary" className="mt-4 w-full">
              <Zap className="size-3.5" /> Create {active.name} Environment
            </ButtonBase>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.64rem] text-muted-foreground/80">
              <Activity className="size-3" /> hover a tile to inspect it live
            </p>
          </Panel>
        </div>
      )}

      <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
        Prototype catalogue — vendor names and telemetry shown as demo data only
      </p>
    </div>
  );
}
