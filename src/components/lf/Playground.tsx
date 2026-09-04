import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AlertTriangle, Loader2, Send, Wand2 } from "lucide-react";
import { ButtonBase, Panel, PanelBar, Pill, Mono } from "./primitives";
import { JsonView } from "./JsonView";
import { FAULTS, FAULT_EXPLANATION, PLATFORMS, simulateRequest, type ApiResult, type Fault } from "@/lib/logforge";
import { cn } from "@/lib/utils";

export function Playground({ onFaultChange }: { onFaultChange?: (f: Fault) => void }) {
  const [platform, setPlatform] = useState("crowdstrike");
  const [fault, setFault] = useState<Fault>("none");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [explain, setExplain] = useState(false);
  const [fixed, setFixed] = useState(false);

  const setF = (f: Fault) => {
    setFault(f);
    onFaultChange?.(f);
  };

  const send = async () => {
    setLoading(true);
    setExplain(false);
    const res = simulateRequest(fixed && fault !== "latency" ? "none" : fault);
    await new Promise((r) => setTimeout(r, fault === "latency" ? 1400 : 520));
    setResult(fixed && fault !== "none" ? { ...res, status: 200, statusText: "OK (retried after backoff)", latency: 132 } : res);
    setLoading(false);
  };

  const failed = result != null && result.status >= 400;

  return (
    <Panel className="overflow-hidden">
      <PanelBar label={<>api console — sample environment</>}>
        <Pill tone={failed ? "error" : "success"}>
          <span className={cn("status-dot", failed ? "text-error" : "text-success")} />
          {failed ? "degraded" : "connected"}
        </Pill>
      </PanelBar>

      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-5 border-b border-border/70 p-5 lg:border-b-0 lg:border-r">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Platform</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-surface-2/60 px-3 py-2 font-mono text-[0.8rem] outline-none transition-colors hover:border-primary/40"
              >
                {PLATFORMS.slice(0, 6).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span className="eyebrow">Environment</span>
              <div className="mt-2 rounded-md border border-border bg-surface-2/40 px-3 py-2 font-mono text-[0.8rem] text-muted-foreground">
                Fintech Company — 500 Devices
              </div>
            </div>
          </div>

          <div>
            <span className="eyebrow">Request</span>
            <div className="mt-2 flex items-stretch gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-[oklch(0.145_0.006_260)] px-3 py-2">
                <Mono className="rounded bg-info/10 px-1.5 py-0.5 text-[0.7rem] text-info">GET</Mono>
                <Mono className="text-foreground/90">/devices</Mono>
              </div>
              <ButtonBase variant="primary" onClick={send} disabled={loading}>
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                Send Request
              </ButtonBase>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface-2/30 p-4">
            <p className="text-[0.9rem] font-medium">Now break it.</p>
            <p className="mt-1 text-[0.78rem] text-muted-foreground">
              Inject a fault, then send the same request again.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FAULTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setF(fault === f.id ? "none" : f.id);
                    setFixed(false);
                  }}
                  aria-pressed={fault === f.id}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 font-mono text-[0.72rem] transition-all duration-150",
                    fault === f.id
                      ? "border-error/50 bg-error/12 text-error"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {fixed && (
              <p className="mt-3 font-mono text-[0.7rem] text-success">
                ✓ retry + exponential backoff enabled on the client
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Response</span>
            <AnimatePresence mode="wait">
              {result && !loading && (
                <motion.div key={result.status + result.latency} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                  <Pill tone={result.status >= 400 ? (result.status === 429 ? "warning" : "error") : "success"}>
                    {result.status} {result.statusText}
                  </Pill>
                  <Mono className="text-muted-foreground">{result.latency}ms</Mono>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {loading ? (
            <div className="space-y-2" aria-live="polite">
              {[92, 78, 64, 84, 70].map((w, i) => (
                <div key={i} className="h-3.5 animate-pulse rounded bg-surface-2/70" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : result ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
              <JsonView value={result.body} />
            </motion.div>
          ) : (
            <div className="rounded-md border border-dashed border-border px-4 py-10 text-center">
              <p className="font-mono text-[0.78rem] text-muted-foreground">no request sent yet</p>
              <p className="mt-1 text-[0.75rem] text-muted-foreground/70">
                Press <kbd className="rounded border border-border px-1">Send Request</kbd> to call the mock.
              </p>
            </div>
          )}

          <AnimatePresence>
            {failed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-md border border-warning/35 bg-warning/8 p-4"
              >
                <p className="flex items-start gap-2 text-[0.84rem] text-warning">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  Your integration does not retry this request.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonBase variant="outline" onClick={() => setExplain((e) => !e)}>
                    <Wand2 className="size-3.5" /> Explain Failure
                  </ButtonBase>
                  <ButtonBase
                    variant="primary"
                    onClick={() => {
                      setFixed(true);
                      void send();
                    }}
                  >
                    Fix &amp; Retest
                  </ButtonBase>
                </div>
                <AnimatePresence>
                  {explain && fault !== "none" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden border-t border-warning/25 pt-3 text-[0.8rem] leading-relaxed text-foreground/80"
                    >
                      {FAULT_EXPLANATION[fault as Exclude<Fault, "none">]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}
