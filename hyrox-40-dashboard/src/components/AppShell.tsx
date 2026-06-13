"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, Dumbbell, Flag, Gauge, Home, LineChart, Settings, Utensils, Waves } from "lucide-react";
import { cn } from "@/lib/format";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/metrics", label: "Metrics", icon: LineChart },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/running", label: "Running", icon: Activity },
  { href: "/simulation", label: "Sim", icon: Gauge },
  { href: "/taper", label: "Taper", icon: Flag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-grid min-h-screen">
      <ServiceWorkerRegister />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] border-r border-white/10 bg-ink/78 px-5 py-6 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-aqua/30 bg-aqua/10 shadow-glow">
            <Waves className="h-5 w-5 text-aqua" />
          </div>
          <div>
            <p className="font-display text-xl font-bold tracking-normal text-white">Race Engine 40</p>
            <p className="text-xs uppercase tracking-[0.18em] text-steel">Prep dashboard</p>
          </div>
        </Link>
        <nav className="mt-9 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "tap-highlight flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                  active ? "bg-white text-ink" : "text-steel hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 pb-24 lg:col-start-2 lg:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/88 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {nav.slice(0, 5).map((item) => <MobileItem key={item.href} item={item} active={pathname === item.href} />)}
        </div>
        <div className="mt-1 grid grid-cols-4 gap-1">
          {nav.slice(5).map((item) => <MobileItem key={item.href} item={item} active={pathname === item.href} />)}
        </div>
      </nav>
    </div>
  );
}

function MobileItem({ item, active }: { item: (typeof nav)[number]; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "tap-highlight flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-semibold transition",
        active ? "bg-white text-ink" : "text-steel",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="max-w-full truncate">{item.label}</span>
    </Link>
  );
}
