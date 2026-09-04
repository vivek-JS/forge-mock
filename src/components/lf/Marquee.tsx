import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, TrendingUp, Zap } from "lucide-react";
import { PLATFORMS } from "@/lib/logforge";
import { cn } from "@/lib/utils";

const VERBS = [
  "spun up a mock",
  "injected a 429 storm",
  "broke and fixed auth",
  "replayed an incident",
  "validated schema drift",
  "ran a resilience test",
];

const CITIES = ["Berlin", "Austin", "Bengaluru", "Tel Aviv", "London", "Singapore", "Toronto", "São Paulo"];

function line(i: number) {
  const p = PLATFORMS[(i * 7) % PLATFORMS.length]!;
  return `${CITIES[i % CITIES.length]} · a team ${VERBS[i % VERBS.length]} on ${p.name}`;
}

/** Infinite ticker of synthetic "someone just did this" activity. */
export function LiveTicker() {
  const items = Array.from({ length: 14 }, (_, i) => line(i));
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-surface/50 py-2.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track flex w-max gap-8 font-mono text-[0.72rem] text-muted-foreground">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2">
            <span className="status-dot ping-soft" style={{ background: "var(--cat-appsec)" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Headline statement that cycles with a typewriter-ish swap. */
export function RotatingStatement({
  lines,
  className,
  interval = 3200,
}: {
  lines: string[];
  className?: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % lines.length), interval);
    return () => window.clearInterval(id);
  }, [lines.length, interval]);

  return (
    <span className={cn("relative inline-flex min-h-[1.2em] items-center", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
          className="marker-underline text-primary"
        >
          {lines[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Animated integer counter that counts up when scrolled into view. */
export function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const [v, setV] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return (
    <motion.span
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true }}
      className="tabular-nums"
    >
      {v.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

/** Urgency banner: pulses, counts, and states the cost of not testing. */
export function UrgencyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-lg border border-primary/30 bg-surface/70 p-5 md:p-6"
    >
      <div className="scan-line pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-primary">
            <Flame className="size-3" /> the failure you never tested
          </span>
          <h3 className="mt-3 text-balance text-xl font-semibold leading-snug md:text-2xl">
            Every untested error path is a production incident with a delay timer.
          </h3>
          <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-muted-foreground">
            Teams simulate the break before the customer finds it. The ones that don't, debug it live at 2am.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Zap, label: "fault types", value: 12 },
            { icon: TrendingUp, label: "platforms in catalogue", value: PLATFORMS.length },
            { icon: Flame, label: "minutes to first mock", value: 4 },

          ].map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-surface-2/50 p-3">
              <s.icon className="size-3.5 text-primary" />
              <p className="mt-2 font-mono text-[0.95rem] text-foreground">
                <CountUp to={s.value} />
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="relative mt-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground/60">
        sample data · illustrative prototype metrics
      </p>
    </motion.div>
  );
}
