import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { SCENARIO_STEPS } from "@/lib/logforge";
import { ButtonBase, Panel, PanelBar, Pill, Mono } from "./primitives";
import { cn } from "@/lib/utils";

const SPEEDS = [1, 2, 5];

export function AttackScenario() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= SCENARIO_STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1400 / speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const toneOf = (sev: string) => (sev === "error" ? "text-error" : sev === "warning" ? "text-warning" : "text-info");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Panel>
        <PanelBar label={<>scenario · ransomware-on-endpoint (sample)</>}>
          <Pill tone={playing ? "warning" : "muted"}>
            {playing ? <span className="status-dot text-warning" /> : null}
            {playing ? "replaying" : step >= SCENARIO_STEPS.length - 1 ? "complete" : "ready"}
          </Pill>
        </PanelBar>

        <ol className="relative p-5">
          <span className="absolute left-[4.65rem] top-7 bottom-7 w-px bg-border" aria-hidden />
          {SCENARIO_STEPS.map((s, i) => {
            const active = i <= step;
            return (
              <li key={s.time} className="relative flex gap-4 py-2.5">
                <Mono className={cn("w-12 pt-0.5 text-right", active ? "text-foreground" : "text-muted-foreground/50")}>
                  {s.time}
                </Mono>
                <span className="relative z-10 mt-1.5">
                  <motion.span
                    animate={{ scale: i === step ? 1.35 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={cn(
                      "block size-2.5 rounded-full border",
                      active ? cn("border-current", toneOf(s.severity)) : "border-border",
                    )}
                    style={{ background: active ? "currentColor" : "transparent" }}
                  />
                </span>
                <div className={cn("transition-opacity duration-300", active ? "opacity-100" : "opacity-40")}>
                  <p className={cn("text-[0.9rem]", active && toneOf(s.severity))}>{s.title}</p>
                  <Mono className="text-muted-foreground">{s.detail}</Mono>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/70 p-4">
          <ButtonBase variant="primary" onClick={() => setPlaying(true)} disabled={playing}>
            <Play className="size-3.5" /> Play
          </ButtonBase>
          <ButtonBase variant="outline" onClick={() => setPlaying(false)} disabled={!playing}>
            <Pause className="size-3.5" /> Pause
          </ButtonBase>
          <ButtonBase
            variant="outline"
            onClick={() => {
              setStep(-1);
              setPlaying(true);
            }}
          >
            <RotateCcw className="size-3.5" /> Replay
          </ButtonBase>
          <div className="ml-auto flex overflow-hidden rounded-md border border-border">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                aria-pressed={speed === s}
                className={cn(
                  "px-2.5 py-1.5 font-mono text-[0.72rem] transition-colors",
                  speed === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <PanelBar label={<>correlated api calls</>} />
        {step < 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-mono text-[0.78rem] text-muted-foreground">timeline not started</p>
            <p className="mt-1 text-[0.76rem] text-muted-foreground/70">Press play to stream the incident.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-2 font-normal">Time</th>
                <th className="px-2 py-2 font-normal">Method</th>
                <th className="px-2 py-2 font-normal">Endpoint</th>
                <th className="px-4 py-2 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_STEPS.slice(0, step + 1).map((s) => (
                <motion.tr
                  key={s.time}
                  initial={{ opacity: 0, x: -8, backgroundColor: "oklch(0.78 0.16 60 / 10%)" }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-border/50 font-mono text-[0.74rem]"
                >
                  <td className="px-4 py-2.5 text-muted-foreground">{s.time}:00</td>
                  <td className="px-2 py-2.5 text-info">{s.call.method}</td>
                  <td className="px-2 py-2.5 text-foreground/85">{s.call.endpoint}</td>
                  <td className="px-4 py-2.5 text-right text-success">{s.call.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
