"use client";

import { raceChecklist, taperCarbs, trainingPlan } from "@/data/trainingPlan";
import { useAthleteStore } from "@/lib/athleteStore";
import { Card, PageHeader, Pill, ToggleButton } from "@/components/ui";

export function TaperView() {
  const store = useAthleteStore();
  const taperDays = trainingPlan.filter((day) => day.day >= 31);

  return (
    <>
      <PageHeader eyebrow="Final 10 days" title="Taper + Race Week" subtitle="Less is more. Fitness is built; the job now is reducing fatigue, loading fuel, staying sharp, and arriving calm." />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Taper plan</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {taperDays.map((day) => (
                <div key={day.day} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">Day {day.day}</p>
                    <Pill tone={day.type === "race" ? "ember" : day.intensity === "REST" ? "neutral" : "volt"}>{day.intensity}</Pill>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white/90">{day.title}</p>
                  <p className="mt-1 text-sm leading-5 text-steel">{day.notes}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">What to reduce / keep</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Info title="Reduce" text="Total volume, hard running, PR attempts, new exercises, heavy lunges, long sessions, and anything that creates soreness." />
              <Info title="Keep" text="Movement quality, short activation, mobility, protein, hydration, sodium, tested carbs, and sleep rhythm." />
              <Info title="Avoid" text="New foods, heavy spice, alcohol, excessive caffeine, full simulations, panic training, and late-night work spirals." />
              <Info title="Pacing" text="First third settle, second third maintain, final third attack. Three breaths before each station." />
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Carb / water / sodium</p>
            <div className="mt-4 space-y-2">
              {taperCarbs.map((item) => (
                <div key={item.day} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-bold text-white">Day {item.day}: {item.carbs}</p>
                  <p className="mt-1 text-sm text-steel">{item.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-steel">Water rises to 3.5-4L daily from Day 35. Add 1.5-2g sodium above normal from Day 37.</p>
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Race-day checklist</p>
            <div className="mt-4 space-y-2">
              {raceChecklist.map((item) => (
                <ToggleButton key={item} checked={!!store.state.raceChecklist[item]} onClick={() => store.toggleRaceChecklist(item)}>
                  {item}
                </ToggleButton>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="font-bold text-white">{title}</p>
      <p className="mt-1 text-sm leading-5 text-steel">{text}</p>
    </div>
  );
}
