import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative border-t border-border/70 py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-5">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-10 max-w-3xl"
          >
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && (
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.08]">
                {title}
              </h2>
            )}
            {lede && <p className="mt-4 text-[0.975rem] leading-relaxed text-muted-foreground">{lede}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("panel", className)}>{children}</div>;
}

export function PanelBar({ label, children }: { label: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-surface-2/40 px-4 py-2.5">
      <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function Pill({
  tone = "muted",
  children,
  className,
}: {
  tone?: "muted" | "success" | "warning" | "error" | "info" | "primary";
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "border-border text-muted-foreground",
    success: "border-success/35 text-success bg-success/8",
    warning: "border-warning/35 text-warning bg-warning/8",
    error: "border-error/40 text-error bg-error/8",
    info: "border-info/35 text-info bg-info/8",
    primary: "border-primary/40 text-primary bg-primary/8",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[0.82rem]", className)}>{children}</span>;
}

/** Headline word with an animated marker underline. */
export function Underlined({ children }: { children: ReactNode }) {
  return <span className="marker-underline">{children}</span>;
}

export function DemoDataNote({ children = "Demo data — synthetic sample environment" }: { children?: ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
      {children}
    </p>
  );
}

export function ButtonBase({
  variant = "ghost",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" }) {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_10px_30px_-14px_oklch(0.78_0.16_60/70%)]",
    ghost: "text-foreground/85 hover:text-foreground hover:bg-accent/60",
    outline: "border border-border bg-surface-2/40 text-foreground/90 hover:border-primary/50 hover:text-foreground",
    danger: "border border-error/40 bg-error/10 text-error hover:bg-error/16",
  };
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-[0.83rem] font-medium transition-all duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
