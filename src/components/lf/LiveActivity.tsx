import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, X } from "lucide-react";
import { makeRow, statusTone, DEVICE_BODY, type LogRow } from "@/lib/logforge";
import { ButtonBase, Panel, PanelBar, Pill, Mono } from "./primitives";
import { JsonView } from "./JsonView";
import { cn } from "@/lib/utils";

const TABS = ["Request", "Response", "Headers", "Timeline", "Schema"] as const;

export function LiveActivity({ chaos = false, extra }: { chaos?: boolean; extra?: LogRow | null }) {
  const [rows, setRows] = useState<LogRow[]>(() => Array.from({ length: 6 }, () => makeRow(false)));
  const [streaming, setStreaming] = useState(true);
  const [selected, setSelected] = useState<LogRow | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Response");
  const seenExtra = useRef<string | null>(null);

  useEffect(() => {
    if (!streaming) return;
    const id = setInterval(() => {
      setRows((r) => [makeRow(chaos), ...r].slice(0, 120));
    }, chaos ? 700 : 1600);
    return () => clearInterval(id);
  }, [streaming, chaos]);

  useEffect(() => {
    if (extra && seenExtra.current !== extra.id) {
      seenExtra.current = extra.id;
      setRows((r) => [extra, ...r].slice(0, 120));
    }
  }, [extra]);

  return (
    <Panel className="overflow-hidden">
      <PanelBar label={<>live api activity — sse stream (simulated)</>}>
        <Pill tone={streaming ? "success" : "muted"}>
          <span className={cn("status-dot", streaming ? "text-success" : "text-muted-foreground")} />
          {streaming ? "streaming" : "paused"}
        </Pill>
        <button
          onClick={() => setStreaming((s) => !s)}
          aria-label={streaming ? "Pause stream" : "Resume stream"}
          className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {streaming ? <Pause className="size-3" /> : <Play className="size-3" />}
        </button>
      </PanelBar>

      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="max-h-[420px] overflow-y-auto border-b border-border/70 lg:border-b-0 lg:border-r">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
              <tr className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-2 font-normal">Time</th>
                <th className="px-2 py-2 font-normal">Method</th>
                <th className="px-2 py-2 font-normal">Endpoint</th>
                <th className="px-2 py-2 font-normal">Status</th>
                <th className="px-4 py-2 text-right font-normal">Latency</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, backgroundColor: "oklch(0.78 0.16 60 / 10%)" }}
                    animate={{ opacity: 1, backgroundColor: "transparent" }}
                    transition={{ duration: 0.45 }}
                    tabIndex={0}
                    onClick={() => setSelected(r)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(r);
                      }
                    }}
                    className={cn(
                      "cursor-pointer border-t border-border/50 font-mono text-[0.74rem] transition-colors hover:bg-accent/40",
                      selected?.id === r.id && "bg-accent/50",
                    )}
                  >
                    <td className="px-4 py-2 text-muted-foreground">{r.time}</td>
                    <td className="px-2 py-2 text-info">{r.method}</td>
                    <td className="px-2 py-2 text-foreground/85">{r.endpoint}</td>
                    <td className={cn("px-2 py-2", statusTone(r.status))}>{r.status}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{r.latency}ms</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="min-h-[300px] p-4">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Mono className="text-info">{selected.method}</Mono>{" "}
                  <Mono className="text-foreground/90">{selected.endpoint}</Mono>
                  <div className="mt-1 flex items-center gap-2">
                    <Pill tone={selected.status >= 400 ? (selected.status === 429 ? "warning" : "error") : "success"}>
                      {selected.status}
                    </Pill>
                    <Mono className="text-muted-foreground">{selected.latency}ms · {selected.time}</Mono>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close inspector"
                  className="rounded border border-border p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>

              <div className="mt-4 flex gap-1 border-b border-border" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "-mb-px border-b px-2.5 py-1.5 font-mono text-[0.7rem] transition-colors",
                      tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                {tab === "Response" && (
                  <JsonView
                    value={
                      selected.status >= 400
                        ? { errors: [{ code: selected.status, message: selected.status === 429 ? "rate limit exceeded" : "request failed" }] }
                        : { resources: [DEVICE_BODY], meta: { pagination: { total: 500, offset: 0, limit: 50 } } }
                    }
                  />
                )}
                {tab === "Request" && (
                  <JsonView value={{ method: selected.method, url: `https://mock.logforge.dev/cs${selected.endpoint}`, query: { limit: 50, offset: 0 } }} />
                )}
                {tab === "Headers" && (
                  <JsonView
                    value={{
                      "content-type": "application/json",
                      "x-ratelimit-limit": 100,
                      "x-ratelimit-remaining": selected.status === 429 ? 0 : 74,
                      "x-logforge-env": "cs/6f2a91b4",
                    }}
                  />
                )}
                {tab === "Timeline" && (
                  <ul className="space-y-2 font-mono text-[0.72rem]">
                    {[
                      ["dns", 2],
                      ["tcp + tls", 11],
                      ["request sent", 1],
                      ["ttfb", Math.max(1, selected.latency - 20)],
                      ["download", 6],
                    ].map(([k, v]) => (
                      <li key={k as string}>
                        <div className="flex justify-between text-muted-foreground">
                          <span>{k}</span>
                          <span>{v}ms</span>
                        </div>
                        <div className="mt-1 h-1 rounded bg-surface-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((v as number) / selected.latency) * 100)}%` }}
                            transition={{ duration: 0.4 }}
                            className="h-1 rounded bg-primary/70"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {tab === "Schema" && (
                  <JsonView value={{ device_id: "string", hostname: "string", platform: "enum(windows|macos|linux)", status: "enum(online|offline|contained)", last_seen: "date-time" }} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-12 text-center">
              <p className="font-mono text-[0.78rem] text-muted-foreground">no request selected</p>
              <p className="mt-1 max-w-[22ch] text-[0.75rem] text-muted-foreground/70">
                Select any row to inspect request, response, headers, timing and schema.
              </p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
