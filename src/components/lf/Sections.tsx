import { motion } from "motion/react";
import { Check, Copy, GitBranch, Play, X } from "lucide-react";
import { FOMO } from "@/lib/logforge";
import { ButtonBase, Panel, PanelBar, Pill, Mono } from "./primitives";
import { useState } from "react";

/* ---------- 11. Productive FOMO ---------- */
export function FomoStrip() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {FOMO.map((f, i) => (
        <motion.div
          key={f}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="group flex gap-3 rounded-md border border-border bg-surface/60 p-4 transition-colors hover:border-primary/40"
        >
          <span className="mt-0.5 font-mono text-[0.7rem] text-primary">{String(i + 1).padStart(2, "0")}</span>
          <p className="text-[0.88rem] leading-relaxed text-foreground/85">{f}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 12. Before / After ---------- */
const WITHOUT = [
  "Wait for vendor environment",
  "Request credentials",
  "Find usable test data",
  "Manually reproduce errors",
  "Coordinate with QA",
  "Discover edge cases late",
  "Production uncertainty",
];
const WITH = [
  "Choose platform",
  "Generate environment",
  "Connect API",
  "Simulate scenarios",
  "Break integration",
  "Fix issues",
  "Validate readiness",
  "Ship confidently",
];

export function BeforeAfter() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel className="overflow-hidden">
        <PanelBar label={<>without log forge</>}>
          <Pill tone="error">weeks</Pill>
        </PanelBar>
        <ul className="divide-y divide-border/50">
          {WITHOUT.map((w, i) => (
            <motion.li
              key={w}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.22 }}
              className="flex items-center gap-3 px-4 py-3 font-mono text-[0.78rem] text-muted-foreground"
            >
              <X className="size-3.5 shrink-0 text-error/70" /> {w}
            </motion.li>
          ))}
        </ul>
      </Panel>

      <Panel className="overflow-hidden">
        <PanelBar label={<>with log forge</>}>
          <Pill tone="success">an afternoon</Pill>
        </PanelBar>
        <ul className="divide-y divide-border/50">
          {WITH.map((w, i) => (
            <motion.li
              key={w}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: i * 0.06 }}
              className="flex items-center gap-3 px-4 py-3 font-mono text-[0.78rem] text-foreground/85"
            >
              <Check className="size-3.5 shrink-0 text-success" /> {w}
            </motion.li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------- 13. Team collaboration ---------- */
const ROLES = [
  { role: "Developer", does: "builds integration" },
  { role: "QA Engineer", does: "runs scenarios" },
  { role: "Support Engineer", does: "reproduces customer issues" },
  { role: "Product Manager", does: "validates workflows" },
  { role: "Security Engineer", does: "verifies behaviour" },
];

export function Collaboration() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.role}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-md border border-border bg-surface/60 p-4"
          >
            <p className="text-[0.9rem] font-medium">{r.role}</p>
            <p className="mt-1 font-mono text-[0.74rem] text-muted-foreground">→ {r.does}</p>
          </motion.div>
        ))}
      </div>

      <Panel>
        <PanelBar label={<>shared environment</>}>
          <Pill tone="info">read-write</Pill>
        </PanelBar>
        <div className="p-5">
          <Mono className="text-foreground/90">CrowdStrike / Customer Issue #2841</Mono>
          <p className="mt-2 font-mono text-[0.72rem] text-muted-foreground">
            mock.logforge.dev/cs/2841 · 500 devices · 429 profile pinned
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonBase
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText("https://mock.logforge.dev/cs/2841");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1400);
                } catch { /* noop */ }
              }}
            >
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy Environment"}
            </ButtonBase>
            <ButtonBase variant="outline">
              <GitBranch className="size-3.5" /> Clone
            </ButtonBase>
            <ButtonBase variant="outline">
              <Play className="size-3.5" /> Replay
            </ButtonBase>
          </div>
        </div>
      </Panel>
    </div>
  );
}
