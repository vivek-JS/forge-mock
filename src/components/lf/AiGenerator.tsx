import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Sparkles } from "lucide-react";
import { ButtonBase, Panel, PanelBar, Pill } from "./primitives";

const EXAMPLE =
  "Create a fintech company with 1,000 employees, 700 Windows devices, 200 Macs, 100 Linux machines and 25 compromised endpoints.";

const FIELDS = [
  { label: "Organization", value: "Fintech Demo" },
  { label: "Users", value: "1,000" },
  { label: "Devices", value: "1,000" },
  { label: "Windows", value: "700" },
  { label: "macOS", value: "200" },
  { label: "Linux", value: "100" },
  { label: "Compromised", value: "25", tone: "error" as const },
  { label: "Threat Level", value: "HIGH", tone: "warning" as const },
];

export function AiGenerator() {
  const [prompt, setPrompt] = useState(EXAMPLE);
  const [phase, setPhase] = useState<"idle" | "parsing" | "ready">("idle");
  const [shown, setShown] = useState(0);

  const run = () => {
    setPhase("parsing");
    setShown(0);
    setTimeout(() => {
      setPhase("ready");
      FIELDS.forEach((_, i) => setTimeout(() => setShown(i + 1), i * 110));
    }, 900);
  };

  return (
    <Panel>
      <PanelBar label={<>environment intent → schema</>}>
        <Pill tone="primary">
          <Sparkles className="size-3" /> inline ai
        </Pill>
      </PanelBar>

      <div className="grid lg:grid-cols-[1fr_1fr]">
        <div className="border-b border-border/70 p-5 lg:border-b-0 lg:border-r">
          <label className="eyebrow" htmlFor="lf-prompt">
            Describe the environment
          </label>
          <textarea
            id="lf-prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-2 w-full resize-none rounded-md border border-input bg-[oklch(0.145_0.006_260)] p-3 font-mono text-[0.8rem] leading-relaxed outline-none transition-colors hover:border-primary/40"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ButtonBase variant="primary" onClick={run} disabled={phase === "parsing"}>
              {phase === "parsing" ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              Generate Environment
            </ButtonBase>
            <ButtonBase variant="outline" onClick={() => setPrompt(EXAMPLE)}>
              Use example
            </ButtonBase>
          </div>
          <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
            The prompt compiles into a typed environment spec — not a chat transcript. Every field stays
            editable before generation.
          </p>
        </div>

        <div className="p-5">
          <span className="eyebrow">Parsed configuration</span>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {phase === "parsing" &&
              FIELDS.map((_, i) => <div key={i} className="h-[62px] animate-pulse rounded-md bg-surface-2/70" />)}

            {phase === "idle" &&
              FIELDS.map((f) => (
                <div key={f.label} className="rounded-md border border-dashed border-border px-3 py-2.5">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/60">{f.label}</p>
                  <p className="mt-1 font-mono text-[0.9rem] text-muted-foreground/30">—</p>
                </div>
              ))}

            <AnimatePresence>
              {phase === "ready" &&
                FIELDS.slice(0, shown).map((f) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-md border border-border bg-surface-2/40 px-3 py-2.5"
                  >
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{f.label}</p>
                    <p
                      className={
                        "mt-1 font-mono text-[0.95rem] " +
                        (f.tone === "error" ? "text-error" : f.tone === "warning" ? "text-warning" : "text-foreground")
                      }
                    >
                      {f.value}
                    </p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {phase === "ready" && shown === FIELDS.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex gap-2">
              <ButtonBase variant="outline">Edit Configuration</ButtonBase>
              <ButtonBase variant="primary">Generate Environment</ButtonBase>
            </motion.div>
          )}
        </div>
      </div>
    </Panel>
  );
}
