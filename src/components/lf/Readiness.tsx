import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Check, PlayCircle } from "lucide-react";
import { READINESS_METRICS } from "@/lib/logforge";
import { ButtonBase, Panel, PanelBar, Pill } from "./primitives";

function useCounter(target: number, run: boolean) {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const from = v;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setV(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, run]);
  return v;
}

export function Readiness() {
  const [improved, setImproved] = useState(false);
  const score = useCounter(improved ? 94 : 82, true);
  const R = 54;
  const pct = score / 100;

  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel className="flex flex-col items-center justify-center p-8">
        <div className="relative grid place-items-center">
          <svg width="160" height="160" viewBox="0 0 128 128" className="-rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="var(--hairline)" strokeWidth="8" />
            <motion.circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * R}
              animate={{ strokeDashoffset: 2 * Math.PI * R * (1 - pct) }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </svg>
          <div className="absolute text-center">
            <p className="font-mono text-[2.5rem] leading-none">{score}%</p>
            <p className="eyebrow mt-2">Production Readiness</p>
          </div>
        </div>
        <ButtonBase variant="primary" className="mt-8 w-full py-2.5" onClick={() => setImproved(true)} disabled={improved}>
          <PlayCircle className="size-3.5" /> {improved ? "All tests passing" : "Run Missing Tests"}
        </ButtonBase>
        <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
          sample scoring model
        </p>
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelBar label={<>readiness breakdown</>}>
            <Pill tone={improved ? "success" : "warning"}>{improved ? "82% → 94%" : "1 gap open"}</Pill>
          </PanelBar>
          <div className="space-y-3 p-5">
            {READINESS_METRICS.map((m) => {
              const val = improved ? m.after : m.before;
              return (
                <div key={m.label}>
                  <div className="flex justify-between font-mono text-[0.74rem]">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-surface-2">
                    <motion.div
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                      className="h-full rounded"
                      style={{
                        background: val >= 90 ? "var(--success)" : val >= 75 ? "var(--primary)" : "var(--warning)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="grid gap-2 p-5 sm:grid-cols-2">
          {["Authentication tested", "Pagination tested", "401 tested", "429 tested", "500 tested", "Large datasets tested"].map(
            (t) => (
              <p key={t} className="flex items-center gap-2 font-mono text-[0.74rem] text-success">
                <Check className="size-3.5" /> {t}
              </p>
            ),
          )}
          <p className="flex items-center gap-2 font-mono text-[0.74rem] sm:col-span-2">
            {improved ? (
              <span className="flex items-center gap-2 text-success">
                <Check className="size-3.5" /> Token expiration tested
              </span>
            ) : (
              <span className="flex items-center gap-2 text-warning">
                <AlertTriangle className="size-3.5" /> Token expiration needs testing
              </span>
            )}
          </p>
        </Panel>
      </div>
    </div>
  );
}
