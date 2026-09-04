import { PLATFORMS } from "@/lib/logforge";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Play, ArrowRight, Terminal as TerminalIcon, RotateCcw } from "lucide-react";
import { ButtonBase, Panel, PanelBar, Pill, Underlined } from "./primitives";
import { IntegrationGraph } from "./IntegrationGraph";

const LINES = [
  { text: "Creating environment...", kind: "info" as const, ms: 500 },
  { text: "Organization generated", kind: "ok" as const, ms: 420 },
  { text: "500 endpoints created", kind: "ok" as const, ms: 380 },
  { text: "1,200 users generated", kind: "ok" as const, ms: 400 },
  { text: "Security events seeded", kind: "ok" as const, ms: 460 },
  { text: "API authentication configured", kind: "ok" as const, ms: 360 },
  { text: "Mock server started", kind: "ok" as const, ms: 420 },
];

const CMD = "logforge create crowdstrike";

function useTerminal(runId: number) {
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTyped("");
    setStep(-1);
    setDone(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setTyped(CMD);
      setStep(LINES.length);
      setDone(true);
      return;
    }

    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(CMD.slice(0, i));
      if (i >= CMD.length) {
        clearInterval(type);
        let acc = 260;
        LINES.forEach((l, idx) => {
          acc += l.ms;
          timers.push(setTimeout(() => setStep(idx), acc));
        });
        timers.push(setTimeout(() => setDone(true), acc + 420));
      }
    }, 42);

    return () => {
      clearInterval(type);
      timers.forEach(clearTimeout);
    };
  }, [runId]);

  return { typed, step, done };
}

export function Hero() {
  const [runId, setRunId] = useState(0);
  const { typed, step, done } = useTerminal(runId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [step, done]);

  return (
    <section className="relative overflow-hidden pt-30 pb-16 md:pt-36 md:pb-24">
      <div className="hairline-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, oklch(0.78 0.16 60 / 22%), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-start gap-12 px-5 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 font-mono text-[0.72rem] text-muted-foreground">
              <span className="status-dot text-success" />
              42 Mock Environments Running
              <span className="text-muted-foreground/50">· sample data</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-6 text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-tight md:text-[3.4rem]"
          >
            Build against security APIs you <Underlined>don't have access to.</Underlined>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground"
          >
            Create realistic security environments in minutes. Develop, test and validate integrations
            before connecting to customer infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/demo">
              <ButtonBase variant="primary" className="px-5 py-2.5">
                <Play className="size-3.5" /> Launch Interactive Demo
              </ButtonBase>
            </Link>
            <a href="#platforms">
              <ButtonBase variant="outline" className="px-5 py-2.5">
                Explore {PLATFORMS.length} Integrations <ArrowRight className="size-3.5" />
              </ButtonBase>
            </a>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
            {[`${PLATFORMS.length} Security Platforms`, "Minutes to First Mock", "Realistic API Behaviour", "Production Readiness Testing"].map(
              (t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.06 }}
                  className="text-[0.8rem] leading-snug text-muted-foreground"
                >
                  <span className="mr-1.5 text-primary">▸</span>
                  {t}
                </motion.div>
              ),
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-muted-foreground/70">
            {["Build", "Simulate", "Break", "Debug", "Validate", "Ship"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="text-primary/50">→</span>}
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Panel>
            <PanelBar
              label={
                <>
                  <TerminalIcon className="size-3.5" /> logforge cli
                </>
              }
            >
              <button
                onClick={() => setRunId((r) => r + 1)}
                className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <RotateCcw className="size-3" /> replay
              </button>
            </PanelBar>

            <div ref={scrollRef} className="max-h-[330px] overflow-y-auto px-4 py-4 font-mono text-[0.78rem] leading-[1.75]">
              <div>
                <span className="text-primary">$</span> <span className={typed.length < CMD.length ? "caret" : ""}>{typed}</span>
              </div>
              <AnimatePresence>
                {LINES.slice(0, step + 1).map((l) => (
                  <motion.div
                    key={l.text}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22 }}
                    className={l.kind === "ok" ? "text-foreground/85" : "text-muted-foreground"}
                  >
                    {l.kind === "ok" ? <span className="text-success">✓ </span> : null}
                    {l.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                  <div className="text-foreground">
                    Environment ready in <span className="text-primary">4.2s</span>
                  </div>
                  <div className="text-muted-foreground">
                    Endpoint:{" "}
                    <span className="text-[color:var(--link)]">mock.logforge.dev/cs/6f2a91b4</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link to="/demo">
                      <ButtonBase variant="outline" className="py-1.5 font-mono text-[0.72rem]">
                        Open Environment
                      </ButtonBase>
                    </Link>
                    <Pill tone="success">
                      <span className="status-dot text-success" /> connected
                    </Pill>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-border/80 px-4 py-5">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="graph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <IntegrationGraph compact active platform="CrowdStrike" />
                  </motion.div>
                ) : (
                  <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-2.5" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="mx-auto h-8 w-48 animate-pulse rounded-md bg-surface-2/70" />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Panel>
        </motion.div>
      </div>
    </section>
  );
}
