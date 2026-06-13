"use client";

import { trainingPlan } from "@/data/trainingPlan";
import { getCheckInForDay, useAthleteStore } from "@/lib/athleteStore";
import { pct } from "@/lib/format";
import { Card, PageHeader, Pill, ProgressBar, ToggleButton } from "@/components/ui";

export function WorkoutView() {
  const store = useAthleteStore();
  const day = trainingPlan[store.currentDay - 1];
  const checkIn = getCheckInForDay(store.state, day.day);
  const completeCount = day.sections.filter((section) => checkIn.sectionCompletions[section.id]).length;

  return (
    <>
      <PageHeader
        eyebrow="Today’s work"
        title={`Day ${day.day}: ${day.title}`}
        subtitle={`${day.focus}. ${day.notes}`}
        action={<Pill tone={day.intensity === "HIGH" ? "ember" : "aqua"}>{day.intensity}</Pill>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Sections complete</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{completeCount}/{day.sections.length}</p>
          <div className="mt-4"><ProgressBar value={pct(completeCount, day.sections.length)} /></div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Step target</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{day.stepTarget.toLocaleString("en-IN")}</p>
          <p className="mt-2 text-sm text-steel">Walking is part of the plan, not extra credit.</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Session note</p>
          <textarea
            className="mt-3 min-h-24 w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-steel/60"
            placeholder="One sentence after training"
            value={checkIn.notes ?? ""}
            onChange={(event) => store.updateCheckIn(day.day, { notes: event.target.value })}
          />
        </Card>
      </div>
      <div className="space-y-4">
        {day.sections.map((section) => (
          <Card key={section.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-white">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-steel">{section.detail}</p>
                {section.target ? <p className="mt-2 text-sm font-bold text-aqua">{section.target}</p> : null}
              </div>
              <div className="w-full md:w-56">
                <ToggleButton checked={!!checkIn.sectionCompletions[section.id]} onClick={() => store.toggleSection(day.day, section.id)}>
                  Complete
                </ToggleButton>
              </div>
            </div>
            {section.items?.length ? (
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/88">{item}</div>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </>
  );
}
