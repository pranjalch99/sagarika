"use client";

import { Droplets, Soup, Utensils } from "lucide-react";
import { macroTargets, taperCarbs, trainingPlan } from "@/data/trainingPlan";
import { getCheckInForDay, useAthleteStore } from "@/lib/athleteStore";
import { pct } from "@/lib/format";
import { Card, Field, PageHeader, Pill, ProgressBar } from "@/components/ui";

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

export function NutritionView() {
  const store = useAthleteStore();
  const day = trainingPlan[store.currentDay - 1];
  const target = macroTargets[day.nutritionKey];
  const checkIn = getCheckInForDay(store.state, store.currentDay);

  return (
    <>
      <PageHeader eyebrow="Fuel plan" title="Nutrition" subtitle="Protect performance while cutting. Protein is non-negotiable, carbs move around the hard sessions, and race week is about stored energy." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <Pill tone="aqua">Training day</Pill>
          <p className="mt-4 font-display text-4xl font-bold text-white">{macroTargets.training.calories}</p>
          <p className="text-sm text-steel">kcal · P {macroTargets.training.protein}g / C {macroTargets.training.carbs}g / F {macroTargets.training.fats}g</p>
        </Card>
        <Card>
          <Pill>Rest day</Pill>
          <p className="mt-4 font-display text-4xl font-bold text-white">{macroTargets.rest.calories}</p>
          <p className="text-sm text-steel">kcal · P {macroTargets.rest.protein}g / C {macroTargets.rest.carbs}g / F {macroTargets.rest.fats}g</p>
        </Card>
        <Card>
          <Pill tone="volt">Today</Pill>
          <p className="mt-4 font-display text-4xl font-bold text-white">{target.calories}</p>
          <p className="text-sm text-steel">Day {day.day}: {day.nutritionKey.replace("-", " ")}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Daily macro check-in</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Calories" value={checkIn.calories ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { calories: toNumber(value) })} />
            <Field label="Protein" suffix="g" value={checkIn.protein ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { protein: toNumber(value) })} />
            <Field label="Carbs" suffix="g" value={checkIn.carbs ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { carbs: toNumber(value) })} />
            <Field label="Fats" suffix="g" value={checkIn.fats ?? ""} onChange={(value) => store.updateCheckIn(store.currentDay, { fats: toNumber(value) })} />
          </div>
          <div className="mt-5 space-y-3">
            <MacroProgress label="Calories" value={checkIn.calories} target={target.calories} />
            <MacroProgress label="Protein" value={checkIn.protein} target={target.protein} />
            <MacroProgress label="Carbs" value={checkIn.carbs} target={target.carbs} />
            <MacroProgress label="Fats" value={checkIn.fats} target={target.fats} />
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <Utensils className="h-5 w-5 text-aqua" />
              <h2 className="text-lg font-extrabold text-white">Meal timing</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Info title="Pre-workout" text="60-90 min before: oats, banana, 30g whey, coffee. Aim 60g carbs + 30g protein." />
              <Info title="Post-workout" text="Within 45 min: 40-50g whey plus rice or roti and vegetables." />
              <Info title="Pre-sleep" text="Low-fat curd or casein. Keep protein distribution steady across the day." />
              <Info title="Troubleshooting" text="If performance crashes, add 150-200 kcal to training days for five days." />
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-cobalt" />
              <h2 className="text-lg font-extrabold text-white">Hydration and sodium</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-steel">Minimum 3L water daily. Training days 3.5-4L. Add 500mg sodium before HYROX days and long runs. From Day 37, add 1.5-2g sodium above normal.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Soup className="h-5 w-5 text-volt" />
              <h2 className="text-lg font-extrabold text-white">Race-week carb strategy</h2>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {taperCarbs.map((item) => <Info key={item.day} title={`Day ${item.day}: ${item.carbs}`} text={item.note} />)}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function MacroProgress({ label, value, target }: { label: string; value?: number; target: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-[0.12em] text-steel">
        <span>{label}</span>
        <span>{value ?? 0}/{target}</span>
      </div>
      <ProgressBar value={pct(value ?? 0, target)} />
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-sm leading-5 text-steel">{text}</p>
    </div>
  );
}
