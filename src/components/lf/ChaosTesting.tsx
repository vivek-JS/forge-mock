import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Zap } from "lucide-react";
import { ButtonBase, Panel, PanelBar, Pill } from "./primitives";
import { IntegrationGraph } from "./IntegrationGraph";
import { cn } from "@/lib/utils";

type Toggle = { label: string; on: boolean; value?: string };

export function ChaosTesting({ onChaosChange }: { onChaosChange?: (on: boolean) => void }) {
  const [toggles, setToggles] = useState<Toggle[]>([
    { label: "Latency", on: true, value: "2000 ms" },
    { label: "500 Errors", on: true, value: "10%" },
    { label: "Rate Limit", on: true },
    { label: "Token Expiration", on: false },
    { label: "Timeout", on: false },
    { label: "Malformed JSON", on: false },
  ]);
  const [running, setRunning] = useState(false);
  const [tested, setTested] = useState(0);
  const [failed, setFailed] = useState(0);
  const [weaknesses, setWeaknesses] = useState(false);

  useEffect(() => {
    onChaosChange?.(running);
    if (!running) return;
    const id = setInterval(() => {
      setTested((t) => {
        if (t >= 17) {
          clearInterval(id);
          setRunning(false);
          return t;
        }
        if (Math.random() < 0.3) setFailed((f) => f + 1);
        return t + 1;
      });
    }, 260);
    return () => clearInterval(id);
  }, [running, onChaosChange]);

  const recovered = tested - failed;
  const score = tested === 0 ? 0 : Math.round((recovered / tested) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Panel>
        <PanelBar label={<>fault injection profile</>}>
          <Pill tone={running ? "error" : "muted"}>
            {running ? <span className="status-dot text-error" /> : null}
            {running ? "chaos active" : "idle"}
          </Pill>
        </PanelBar>
        <div className="divide-y divide-border/60">
          {toggles.map((t, i) => (
            <div key={t.label} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-[0.86rem]">{t.label}</p>
                {t.value && <p className="font-mono text-[0.7rem] text-muted-foreground">{t.value}</p>}
              </div>
              <button
                role="switch"
                aria-checked={t.on}
                aria-label={t.label}
                onClick={() =>
                  setToggles((ts) => ts.map((x, xi) => (xi === i ? { ...x, on: !x.on } : x)))
                }
                className={cn(
                  "relative h-5 w-9 rounded-full border transition-colors duration-200",
                  t.on ? "border-error/50 bg-error/25" : "border-border bg-surface-2",
                )}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  className={cn(
                    "absolute top-[2px] size-3.5 rounded-full",
                    t.on ? "left-[18px] bg-error" : "left-[2px] bg-muted-foreground",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-border/70 p-4">
          <ButtonBase
            variant={running ? "danger" : "primary"}
            className="w-full py-2.5"
            onClick={() => {
              setTested(0);
              setFailed(0);
              setWeaknesses(false);
              setRunning(true);
            }}
            disabled={running}
          >
            <Zap className="size-3.5" /> {running ? "Chaos test running…" : "Start Chaos Test"}
          </ButtonBase>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel className="p-5">
          <div className="flex items-start justify-between gap-6">
            <dl className="space-y-2 font-mono text-[0.78rem]">
              <div>
                <dt className="text-muted-foreground">requests tested</dt>
                <dd className="text-[1.4rem] text-foreground">{tested}</dd>
              </div>
              <div className="text-success">✓ {recovered} recovered automatically</div>
              <div className="text-error">✕ {failed} failed</div>
            </dl>
            <div className="text-right">
              <p className="eyebrow">Resilience Score</p>
              <motion.p
                key={score}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "font-mono text-[2.6rem] leading-none",
                  score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-error",
                )}
              >
                {score}%
              </motion.p>
              <ButtonBase variant="outline" className="mt-3" onClick={() => setWeaknesses((w) => !w)} disabled={tested === 0}>
                Show Weaknesses
              </ButtonBase>
            </div>
          </div>
          <AnimatePresence>
            {weaknesses && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-1.5 overflow-hidden border-t border-border pt-4 font-mono text-[0.74rem]"
              >
                {[
                  "no Retry-After handling on 429 — sync drops events",
                  "5xx treated as terminal — pagination cursor lost",
                  "HTTP timeout 1500 ms below vendor p99 (2043 ms)",
                  "no jitter in backoff — thundering herd on recovery",
                ].map((w) => (
                  <li key={w} className="text-warning">
                    ⚠ {w}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </Panel>

        <Panel className="p-6">
          <IntegrationGraph compact active fault={running ? "429" : "none"} />
        </Panel>
      </div>
    </div>
  );
}
