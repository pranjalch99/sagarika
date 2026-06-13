"use client";

import { getCheckInForDay, useAthleteStore } from "@/lib/athleteStore";
import { formatNumber, pct } from "@/lib/format";
import { trainingPlan } from "@/data/trainingPlan";
import { Card, Field, MiniChart, PageHeader, ProgressBar, StatCard, WarningList } from "@/components/ui";

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

export function MetricsView() {
  const store = useAthleteStore();
  const checkIn = getCheckInForDay(store.state, store.currentDay);
  const entries = Array.from({ length: store.currentDay }, (_, index) => getCheckInForDay(store.state, index + 1));
  const latestWeight = checkIn.weight ?? store.state.settings.startingWeight;
  const latestWaist = checkIn.waist ?? store.state.settings.startingWaist;

  return (
    <>
      <PageHeader eyebrow="Body and recovery" title="Metrics" subtitle="Track the few numbers that decide whether the plan is working: body composition, steps, fuel, sleep, fatigue, soreness, and readiness." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Weight" value={formatNumber(latestWeight, " kg")} detail={`${formatNumber(store.state.settings.goalWeight, " kg")} target`} progress={pct(store.state.settings.startingWeight - latestWeight, store.state.settings.startingWeight - store.state.settings.goalWeight)} />
        <StatCard label="Waist" value={formatNumber(latestWaist, " in")} detail="Trend beats noise" progress={pct(store.state.settings.startingWaist - latestWaist, store.state.settings.startingWaist - store.state.settings.goalWaist)} tone="volt" />
        <StatCard label="Steps today" value={formatNumber(checkIn.steps)} detail={`${formatNumber(trainingPlan[store.currentDay - 1].stepTarget)} target`} progress={pct(checkIn.steps ?? 0, trainingPlan[store.currentDay - 1].stepTarget)} tone="cobalt" />
        <StatCard label="Readiness" value={`${store.readinessScore}%`} detail="Readiness minus fatigue cost" progress={store.readinessScore} tone={store.readinessScore < 55 ? "ember" : "aqua"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Today’s entry</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Weight" suffix="kg" value={checkIn.weight ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(store.currentDay, { weight: toNumber(value) })} />
            <Field label="Waist" suffix="in" value={checkIn.waist ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(store.currentDay, { waist: toNumber(value) })} />
            <Field label="Steps" value={checkIn.steps ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { steps: toNumber(value) })} />
            <Field label="Calories" value={checkIn.calories ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { calories: toNumber(value) })} />
            <Field label="Protein" suffix="g" value={checkIn.protein ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { protein: toNumber(value) })} />
            <Field label="Carbs" suffix="g" value={checkIn.carbs ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { carbs: toNumber(value) })} />
            <Field label="Fats" suffix="g" value={checkIn.fats ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { fats: toNumber(value) })} />
            <Field label="Sleep" suffix="h" value={checkIn.sleep ?? ""} step={0.1} onChange={(value) => store.updateCheckIn(store.currentDay, { sleep: toNumber(value) })} />
            <Field label="Fatigue" value={checkIn.fatigue ?? ""} min={1} max={10} onChange={(value) => store.updateCheckIn(store.currentDay, { fatigue: toNumber(value) })} />
            <Field label="Soreness" value={checkIn.soreness ?? ""} min={1} max={10} onChange={(value) => store.updateCheckIn(store.currentDay, { soreness: toNumber(value) })} />
            <Field label="Readiness" value={checkIn.readiness ?? ""} min={1} max={10} onChange={(value) => store.updateCheckIn(store.currentDay, { readiness: toNumber(value) })} />
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm font-bold text-white">Weight trend</p>
            <div className="mt-3"><MiniChart points={entries.map((entry) => entry.weight)} suffix=" kg" /></div>
          </Card>
          <Card>
            <p className="text-sm font-bold text-white">Waist trend</p>
            <div className="mt-3"><MiniChart points={entries.map((entry) => entry.waist)} suffix=" in" /></div>
          </Card>
          <Card>
            <p className="text-sm font-bold text-white">Steps trend</p>
            <div className="mt-3"><MiniChart points={entries.map((entry) => entry.steps)} /></div>
          </Card>
          <Card>
            <p className="text-sm font-bold text-white">Sleep trend</p>
            <div className="mt-3"><MiniChart points={entries.map((entry) => entry.sleep)} suffix=" h" /></div>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <WarningList warnings={store.warnings} />
      </div>
    </>
  );
}
