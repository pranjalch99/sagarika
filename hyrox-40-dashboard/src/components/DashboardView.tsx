"use client";

import Link from "next/link";
import { ArrowRight, Flame, Footprints, Moon, Scale, Target, TimerReset } from "lucide-react";
import { macroTargets, trainingPlan } from "@/data/trainingPlan";
import { getCheckInForDay, useAthleteStore } from "@/lib/athleteStore";
import { formatNumber, pct } from "@/lib/format";
import { Card, Field, PageHeader, Pill, ProgressBar, StatCard, ToggleButton, WarningList } from "@/components/ui";

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

export function DashboardView() {
  const store = useAthleteStore();
  const day = trainingPlan[store.currentDay - 1];
  const checkIn = store.currentCheckIn;
  const target = macroTargets[day.nutritionKey];
  const latestWeight = checkIn.weight ?? store.state.settings.startingWeight;
  const latestWaist = checkIn.waist ?? store.state.settings.startingWaist;
  const weightProgress = pct(store.state.settings.startingWeight - latestWeight, store.state.settings.startingWeight - store.state.settings.goalWeight);
  const waistProgress = pct(store.state.settings.startingWaist - latestWaist, store.state.settings.startingWaist - store.state.settings.goalWaist);
  const sectionsDone = day.sections.filter((section) => checkIn.sectionCompletions[section.id]).length;

  return (
    <>
      <PageHeader
        eyebrow="Daily command center"
        title={`${store.daysToRace} days to race`}
        subtitle={`Day ${store.currentDay} of 40. ${day.title} is the priority. Keep the work clean and leave room for tomorrow.`}
        action={<Pill tone={day.intensity === "HIGH" ? "ember" : day.type === "taper" ? "volt" : "aqua"}>{day.intensity}</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="aqua">Day {day.day}</Pill>
                <Pill>{day.phase}</Pill>
                <Pill tone="cobalt">{day.type.replace("-", " ")}</Pill>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-white">{day.title}</h2>
              <p className="mt-2 text-sm leading-6 text-steel">{day.notes}</p>
            </div>
            <Link href="/workout" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-aqua">
              Open workout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {day.sections.slice(0, 4).map((section) => (
              <ToggleButton key={section.id} checked={!!checkIn.sectionCompletions[section.id]} onClick={() => store.toggleSection(day.day, section.id)}>
                {section.title}
              </ToggleButton>
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.14em] text-steel">
              <span>Session completion</span>
              <span>{sectionsDone}/{day.sections.length}</span>
            </div>
            <ProgressBar value={pct(sectionsDone, day.sections.length)} />
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Quick check-in</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Weight" suffix="kg" value={checkIn.weight ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(day.day, { weight: toNumber(value) })} />
            <Field label="Waist" suffix="in" value={checkIn.waist ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(day.day, { waist: toNumber(value) })} />
            <Field label="Steps" value={checkIn.steps ?? ""} onChange={(value) => store.updateCheckIn(day.day, { steps: toNumber(value) })} />
            <Field label="Sleep" suffix="h" value={checkIn.sleep ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(day.day, { sleep: toNumber(value) })} />
            <Field label="Fatigue" value={checkIn.fatigue ?? ""} min={1} max={10} onChange={(value) => store.updateCheckIn(day.day, { fatigue: toNumber(value) })} />
            <Field label="Readiness" value={checkIn.readiness ?? ""} min={1} max={10} onChange={(value) => store.updateCheckIn(day.day, { readiness: toNumber(value) })} />
          </div>
          <button
            type="button"
            onClick={() => store.updateCheckIn(day.day, { completed: !checkIn.completed })}
            className="mt-4 w-full rounded-lg bg-aqua px-4 py-3 text-sm font-extrabold text-ink transition hover:bg-volt"
          >
            {checkIn.completed ? "Training marked complete" : "Mark day complete"}
          </button>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Weight progress" value={`${formatNumber(latestWeight, " kg")}`} detail={`${store.state.settings.goalWeight} kg target`} progress={weightProgress} tone="aqua" />
        <StatCard label="Waist progress" value={`${formatNumber(latestWaist, " in")}`} detail={`${store.state.settings.goalWaist} in target`} progress={waistProgress} tone="volt" />
        <StatCard label="Weekly compliance" value={`${store.complianceScore}%`} detail="Training + steps over last 7 days" progress={store.complianceScore} tone="cobalt" />
        <StatCard label="Readiness" value={`${store.readinessScore}%`} detail="Readiness adjusted for fatigue and soreness" progress={store.readinessScore} tone={store.readinessScore < 55 ? "ember" : "aqua"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <Footprints className="h-5 w-5 text-aqua" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Step target</p>
              <p className="text-2xl font-bold text-white">{formatNumber(day.stepTarget)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-steel">Start from movement consistency. Desk walks count.</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-ember" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Nutrition target</p>
              <p className="text-2xl font-bold text-white">{target.calories} kcal</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-steel">P {target.protein}g / C {target.carbs}g / F {target.fats}g</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-volt" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Recovery rule</p>
              <p className="text-2xl font-bold text-white">7.5h+</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-steel">Below 6h means trim RPE 8+ work. Keep the habit, reduce the cost.</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <WarningList warnings={store.warnings} />
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Weekly review</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {store.weekCheckIns.slice(-3).map((item) => {
              const planDay = trainingPlan[item.day - 1];
              return (
                <div key={item.day} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-bold text-steel">Day {item.day}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{planDay.title}</p>
                  <p className="mt-2 text-xs text-steel">{item.completed ? "Complete" : "Open"} · {formatNumber(item.steps)} steps</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
