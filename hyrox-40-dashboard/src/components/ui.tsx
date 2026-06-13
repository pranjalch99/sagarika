import { Check, CircleAlert } from "lucide-react";
import { cn, formatNumber } from "@/lib/format";

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-aqua">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold tracking-normal text-white sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-steel sm:text-base">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("glass-panel rounded-lg p-4 sm:p-5", className)}>{children}</section>;
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "aqua" | "ember" | "volt" | "cobalt" }) {
  const tones = {
    neutral: "border-white/10 bg-white/6 text-steel",
    aqua: "border-aqua/30 bg-aqua/10 text-aqua",
    ember: "border-ember/30 bg-ember/10 text-ember",
    volt: "border-volt/30 bg-volt/10 text-volt",
    cobalt: "border-cobalt/30 bg-cobalt/10 text-cobalt",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", tones[tone])}>{children}</span>;
}

export function ProgressBar({ value, color = "bg-aqua" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/8">
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function StatCard({ label, value, detail, progress, tone = "aqua" }: { label: string; value: string; detail?: string; progress?: number; tone?: "aqua" | "ember" | "volt" | "cobalt" }) {
  const color = tone === "ember" ? "bg-ember" : tone === "volt" ? "bg-volt" : tone === "cobalt" ? "bg-cobalt" : "bg-aqua";
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
      </div>
      {detail ? <p className="mt-2 text-sm text-steel">{detail}</p> : null}
      {typeof progress === "number" ? <div className="mt-4"><ProgressBar value={progress} color={color} /></div> : null}
    </Card>
  );
}

export function ToggleButton({ checked, children, onClick }: { checked: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "tap-highlight flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm font-semibold transition active:scale-[0.99]",
        checked ? "border-aqua/40 bg-aqua/12 text-white" : "border-white/10 bg-white/5 text-steel hover:bg-white/8",
      )}
    >
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border", checked ? "border-aqua bg-aqua text-ink" : "border-white/15")}>
        {checked ? <Check className="h-4 w-4" /> : null}
      </span>
      {children}
    </button>
  );
}

export function Field({ label, value, onChange, suffix, min, max, step = 1, type = "number" }: { label: string; value?: number | string; onChange: (value: string) => void; suffix?: string; min?: number; max?: number; step?: number; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-steel">{label}</span>
      <div className="relative">
        <input aria-label={label} className="metric-input pr-12" type={type} value={value ?? ""} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} />
        {suffix ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel">{suffix}</span> : null}
      </div>
    </label>
  );
}

export function MiniChart({ points, suffix = "" }: { points: Array<number | undefined>; suffix?: string }) {
  const clean = points.filter((point): point is number => typeof point === "number");
  const width = 260;
  const height = 90;
  if (clean.length < 2) {
    return <div className="grid h-24 place-items-center rounded-lg border border-dashed border-white/10 text-sm text-steel">Add two entries to draw a trend</div>;
  }
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const span = max - min || 1;
  const coords = clean.map((point, index) => {
    const x = (index / (clean.length - 1)) * width;
    const y = height - ((point - min) / span) * (height - 18) - 9;
    return `${x},${y}`;
  });
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full overflow-visible">
        <polyline fill="none" stroke="rgba(46,230,214,0.95)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={coords.join(" ")} />
        {coords.map((coord) => {
          const [cx, cy] = coord.split(",");
          return <circle key={coord} cx={cx} cy={cy} r="3.5" fill="#b8ff4d" />;
        })}
      </svg>
      <div className="flex justify-between text-xs text-steel">
        <span>{formatNumber(clean[0], suffix)}</span>
        <span>{formatNumber(clean[clean.length - 1], suffix)}</span>
      </div>
    </div>
  );
}

export function WarningList({ warnings }: { warnings: string[] }) {
  if (!warnings.length) return null;
  return (
    <div className="space-y-2">
      {warnings.map((warning) => (
        <div key={warning} className="flex gap-3 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-white">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>{warning}</span>
        </div>
      ))}
    </div>
  );
}
