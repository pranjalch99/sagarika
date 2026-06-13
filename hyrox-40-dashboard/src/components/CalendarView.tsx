"use client";

import { trainingPlan } from "@/data/trainingPlan";
import { getCheckInForDay, useAthleteStore } from "@/lib/athleteStore";
import { cn } from "@/lib/format";
import { Card, PageHeader, Pill } from "@/components/ui";

const typeStyles = {
  strength: "border-cobalt/35 bg-cobalt/10 text-cobalt",
  zone2: "border-aqua/35 bg-aqua/10 text-aqua",
  "long-run": "border-volt/35 bg-volt/10 text-volt",
  simulation: "border-ember/35 bg-ember/10 text-ember",
  recovery: "border-white/15 bg-white/6 text-steel",
  taper: "border-volt/35 bg-volt/10 text-volt",
  race: "border-white bg-white text-ink",
};

export function CalendarView() {
  const store = useAthleteStore();

  return (
    <>
      <PageHeader eyebrow="40-day map" title="Training Calendar" subtitle="Every day has one job. Complete the minimum, write one useful note, and move the plan forward." />
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(typeStyles).map(([type, classes]) => (
          <span key={type} className={cn("rounded-full border px-3 py-1 text-xs font-bold capitalize", classes)}>
            {type.replace("-", " ")}
          </span>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {trainingPlan.map((day) => {
          const checkIn = getCheckInForDay(store.state, day.day);
          const active = day.day === store.currentDay;
          return (
            <Card key={day.day} className={cn("transition hover:-translate-y-0.5", active && "ring-2 ring-aqua/60")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill tone={checkIn.completed ? "volt" : "neutral"}>Day {day.day}</Pill>
                    <span className="text-xs font-bold text-steel">{day.weekday}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-extrabold text-white">{day.title}</h2>
                  <p className="mt-1 text-sm text-steel">{day.focus}</p>
                </div>
                <span className={cn("rounded-full border px-2 py-1 text-[10px] font-bold uppercase", typeStyles[day.type])}>{day.type.replace("-", " ")}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-steel">
                <span>{day.intensity}</span>
                <span>{checkIn.completed ? "Complete" : "Open"}</span>
              </div>
              <textarea
                className="mt-3 min-h-20 w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-steel/60"
                placeholder="Notes"
                value={checkIn.notes ?? ""}
                onChange={(event) => store.updateCheckIn(day.day, { notes: event.target.value })}
              />
            </Card>
          );
        })}
      </div>
    </>
  );
}
