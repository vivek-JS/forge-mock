import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2, Play, Send, Sparkles, Zap } from "lucide-react";
import { Nav } from "@/components/lf/Nav";
import { ButtonBase, Panel, PanelBar, Pill, Mono } from "@/components/lf/primitives";
import { JsonView } from "@/components/lf/JsonView";
import { IntegrationGraph } from "@/components/lf/IntegrationGraph";
import { LiveActivity } from "@/components/lf/LiveActivity";
import { FAULT_EXPLANATION, simulateRequest, type ApiResult } from "@/lib/logforge";
import { cn } from "@/lib/utils";

const TITLE = "Log Forge Interactive Demo — create, call and break a security API";
const DESC =
  "A two-minute guided demo: generate a CrowdStrike mock environment, call it, inject a 429, watch your integration fail and validate resilience. No sign-in, sample data only.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});

const STEPS = [
  "Choose environment",
  "Generate environment",
  "Send GET /devices",
  "Enable 429 simulation",
  "Reproduce the failure",
  "Run resilience test",
  "Demo complete",
];

function Demo() {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [rateLimit, setRateLimit] = useState(false);
  const [sending, setSending] = useState(false);
  const [resilience, setResilience] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep(2);
    }, 1500);
  };

  const send = async () => {
    setSending(true);
    const res = simulateRequest(rateLimit ? "429" : "none");
    await new Promise((r) => setTimeout(r, 600));
    setResult(res);
    setSending(false);
    setStep(rateLimit ? 5 : 3);
  };

  const runTest = () => {
    setTesting(true);
    let v = 0;
    const id = setInterval(() => {
      v += 7;
      setResilience(Math.min(94, v));
      if (v >= 94) {
        clearInterval(id);
        setTesting(false);
        setStep(6);
      }
    }, 120);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-5 pt-28 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Interactive demo · no sign-in required</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-[2.4rem]">
              Create it. Call it. Break it.
            </h1>
          </div>
          <Pill tone="warning">synthetic sample data</Pill>
        </div>

        {/* Progress */}
        <ol className="mt-8 flex flex-wrap gap-2" aria-label="Demo progress">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[0.7rem] transition-colors",
                i < step
                  ? "border-success/40 bg-success/8 text-success"
                  : i === step
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground/60",
              )}
            >
              {i < step ? <Check className="size-3" /> : <span>{i + 1}</span>}
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Panel>
              <PanelBar label={<>step {Math.min(step + 1, STEPS.length)} — {STEPS[Math.min(step, STEPS.length - 1)]}</>}>
                <Pill tone={result && result.status >= 400 ? "error" : "success"}>
                  <span className={cn("status-dot", result && result.status >= 400 ? "text-error" : "text-success")} />
                  {result && result.status >= 400 ? "degraded" : "connected"}
                </Pill>
              </PanelBar>

              <div className="space-y-5 p-5">
                {/* 1 & 2 */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-primary/40 bg-primary/8 p-3">
                    <p className="eyebrow">Environment</p>
                    <p className="mt-1.5 text-[0.9rem]">CrowdStrike — Fintech Demo</p>
                    <Mono className="text-muted-foreground">500 devices · 1,200 users</Mono>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="eyebrow">Endpoint</p>
                    <Mono className="mt-1.5 block text-[color:var(--link)]">
                      {step >= 2 ? "mock.logforge.dev/cs/6f2a91b4" : "— not generated —"}
                    </Mono>
                  </div>
                </div>

                {step < 2 && (
                  <ButtonBase variant="primary" className="w-full py-2.5" onClick={generate} disabled={generating}>
                    {generating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                    {generating ? "Generating environment…" : "Generate Environment"}
                  </ButtonBase>
                )}

                {generating && (
                  <div className="space-y-2" aria-live="polite">
                    {[70, 90, 55, 80].map((w, i) => (
                      <div key={i} className="h-3 animate-pulse rounded bg-surface-2/70" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                )}

                {step >= 2 && (
                  <>
                    <div>
                      <p className="eyebrow">Request</p>
                      <div className="mt-2 flex gap-2">
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-[oklch(0.145_0.006_260)] px-3 py-2">
                          <Mono className="rounded bg-info/10 px-1.5 py-0.5 text-[0.7rem] text-info">GET</Mono>
                          <Mono>/devices</Mono>
                        </div>
                        <ButtonBase variant="primary" onClick={send} disabled={sending}>
                          {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                          Send
                        </ButtonBase>
                      </div>
                    </div>

                    {result && !sending && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Pill tone={result.status >= 400 ? "warning" : "success"}>
                            {result.status} {result.statusText}
                          </Pill>
                          <Mono className="text-muted-foreground">{result.latency}ms</Mono>
                        </div>
                        <JsonView value={result.body} />
                      </motion.div>
                    )}

                    {step >= 3 && (
                      <div className="rounded-md border border-border bg-surface-2/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[0.88rem]">429 Rate Limit simulation</p>
                            <Mono className="text-muted-foreground">inject vendor throttling on the next call</Mono>
                          </div>
                          <button
                            role="switch"
                            aria-checked={rateLimit}
                            aria-label="429 rate limit simulation"
                            onClick={() => {
                              setRateLimit((v) => !v);
                              setStep(4);
                            }}
                            className={cn(
                              "relative h-5 w-9 rounded-full border transition-colors",
                              rateLimit ? "border-error/50 bg-error/25" : "border-border bg-surface-2",
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-[2px] size-3.5 rounded-full transition-all",
                                rateLimit ? "left-[18px] bg-error" : "left-[2px] bg-muted-foreground",
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {step >= 5 && result?.status === 429 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-md border border-warning/35 bg-warning/8 p-4"
                        >
                          <p className="text-[0.86rem] text-warning">⚠ Your integration does not retry this request.</p>
                          <p className="mt-2 text-[0.8rem] leading-relaxed text-foreground/80">
                            {FAULT_EXPLANATION["429"]}
                          </p>
                          <ButtonBase variant="primary" className="mt-3" onClick={runTest} disabled={testing || resilience === 94}>
                            <Zap className="size-3.5" />
                            {testing ? "Running resilience test…" : "Run Automated Resilience Test"}
                          </ButtonBase>
                          {resilience !== null && (
                            <p className="mt-3 font-mono text-[0.78rem]">
                              production readiness{" "}
                              <span className={resilience >= 90 ? "text-success" : "text-warning"}>{resilience}%</span>
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </Panel>

            <AnimatePresence>
              {step === 6 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Panel className="p-6">
                    <p className="eyebrow text-primary">Demo complete</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">You just:</h2>
                    <ul className="mt-4 space-y-1.5 font-mono text-[0.78rem] text-success">
                      {[
                        "Created a security mock environment",
                        "Called a simulated API",
                        "Reproduced a production failure",
                        "Tested recovery behaviour",
                        "Validated integration resilience",
                      ].map((t) => (
                        <li key={t}>✓ {t}</li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <ButtonBase variant="primary" className="px-5 py-2.5">
                        Enter Integration Studio <ArrowRight className="size-3.5" />
                      </ButtonBase>
                      <Link to="/">
                        <ButtonBase variant="outline" className="px-5 py-2.5">
                          Back to overview
                        </ButtonBase>
                      </Link>
                    </div>
                  </Panel>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <Panel className="p-6">
              <IntegrationGraph active={step >= 2} fault={result?.status === 429 ? "429" : "none"} />
            </Panel>
            <Panel className="p-4">
              <p className="eyebrow">Estimated time</p>
              <p className="mt-1.5 font-mono text-[0.8rem] text-muted-foreground">
                ≈ 2 minutes · no installation · sample data only
              </p>
              <Link to="/" className="rule-link mt-3 inline-block font-mono text-[0.75rem] text-primary">
                <Play className="mr-1 inline size-3" /> see the full platform tour
              </Link>
            </Panel>
          </div>
        </div>

        <div className="mt-4">
          <LiveActivity chaos={rateLimit} />
        </div>
      </main>
    </div>
  );
}
