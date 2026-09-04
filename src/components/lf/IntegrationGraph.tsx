import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Props = {
  platform?: string;
  fault?: "none" | "429" | "500" | "latency" | "token";
  active?: boolean;
  compact?: boolean;
  className?: string;
};

const FAULT_LABEL: Record<string, string> = {
  "429": "429 RATE LIMIT",
  "500": "500 SERVER ERROR",
  token: "401 TOKEN EXPIRED",
  latency: "2043 MS LATENCY",
};

function Node({
  label,
  sub,
  tone = "default",
  wide,
}: {
  label: string;
  sub?: string;
  tone?: "default" | "primary" | "error" | "warning";
  wide?: boolean;
}) {
  const tones = {
    default: "border-border bg-surface-2/60 text-foreground/90",
    primary: "border-primary/45 bg-primary/8 text-primary",
    error: "border-error/50 bg-error/10 text-error",
    warning: "border-warning/50 bg-warning/10 text-warning",
  } as const;
  return (
    <div
      className={cn(
        "rounded-md border px-4 py-2.5 text-center font-mono text-[0.72rem] uppercase tracking-[0.14em]",
        tones[tone],
        wide ? "w-full" : "min-w-[190px]",
      )}
    >
      {label}
      {sub && <div className="mt-1 text-[0.66rem] normal-case tracking-normal opacity-60">{sub}</div>}
    </div>
  );
}

function Edge({ tone = "ok", active }: { tone?: "ok" | "bad"; active?: boolean }) {
  const stroke = tone === "bad" ? "var(--error)" : "var(--primary)";
  return (
    <div className="relative flex h-12 w-full items-center justify-center" aria-hidden>
      <svg width="2" height="48" viewBox="0 0 2 48" className="overflow-visible">
        <line x1="1" y1="0" x2="1" y2="48" stroke="var(--hairline)" strokeWidth="1.5" />
        {active && (
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="48"
            stroke={stroke}
            strokeWidth="1.5"
            className="flow-edge"
            opacity="0.9"
          />
        )}
      </svg>
      {active && (
        <motion.span
          className="absolute size-[6px] rounded-full"
          style={{ background: stroke, boxShadow: `0 0 10px ${stroke}` }}
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: 22, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

export function IntegrationGraph({ platform = "CrowdStrike", fault = "none", active = true, compact, className }: Props) {
  const bad = fault !== "none" && fault !== "latency";
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Node label="Your Application" sub="integration under test" />
      <Edge active={active} />
      <div className="relative">
        <Node label="Log Forge" sub="simulation & fault injection" tone="primary" />
        {active && (
          <span className="pointer-events-none absolute inset-x-3 -bottom-px h-px scan-line" aria-hidden />
        )}
      </div>
      <Edge active={active} tone={bad ? "bad" : "ok"} />
      {bad ? (
        <Node label={`⚠ ${FAULT_LABEL[fault]}`} sub="injected fault" tone={fault === "429" ? "warning" : "error"} />
      ) : (
        <Node label={`${platform} Mock`} sub="mock.logforge.dev" />
      )}
      {!compact && (
        <>
          <Edge active={active && !bad} />
          <div className="grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
            {["Devices", "Alerts", "Incidents", "Threats"].map((r) => (
              <div
                key={r}
                className="rounded-md border border-border bg-surface/60 px-2 py-2 text-center font-mono text-[0.68rem] text-muted-foreground"
              >
                /{r.toLowerCase()}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
