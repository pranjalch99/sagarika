"use client";

import { useState } from "react";
import { runningProgression, trainingPlan } from "@/data/trainingPlan";
import { useAthleteStore } from "@/lib/athleteStore";
import { Card, Field, PageHeader, Pill } from "@/components/ui";

const toNumber = (value: string) => (value === "" ? 0 : Number(value));

export function RunningView() {
  const store = useAthleteStore();
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [pace, setPace] = useState("");
  const runDays = trainingPlan.filter((day) => day.type === "zone2" || day.type === "long-run" || day.type === "simulation");

  return (
    <>
      <PageHeader eyebrow="Aerobic engine" title="Running + Zone 2" subtitle="Zone 2 is deliberately boring: easy enough to repeat, frequent enough to change the engine, controlled enough to keep the legs intact." />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <Pill tone="aqua">Zone 2 guide</Pill>
          <h2 className="mt-4 text-xl font-extrabold text-white">112-133 bpm or RPE 4-5</h2>
          <p className="mt-2 text-sm leading-6 text-steel">Talk test: you can say a full sentence but cannot hold a relaxed long conversation. If HR hits 140 and you feel fine, slow down anyway.</p>
          <div className="mt-5 space-y-3">
            {runningProgression.map((item) => (
              <div key={item.week} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-white">{item.week}</p>
                  <span className="text-xs font-bold text-aqua">{item.duration}</span>
                </div>
                <p className="mt-1 text-sm text-steel">{item.hr} · {item.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Run log</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Duration" suffix="min" value={duration} onChange={setDuration} />
            <Field label="Distance" suffix="km" value={distance} step={0.1} onChange={setDistance} />
            <Field label="Avg HR" suffix="bpm" value={heartRate} onChange={setHeartRate} />
            <Field label="Pace" value={pace} type="text" onChange={setPace} />
          </div>
          <button
            type="button"
            onClick={() => {
              store.addRunLog({ day: store.currentDay, type: trainingPlan[store.currentDay - 1].type === "long-run" ? "Long Run" : "Zone 2", duration: toNumber(duration), distance: toNumber(distance), heartRate: heartRate ? Number(heartRate) : undefined, pace });
              setDuration("");
              setDistance("");
              setHeartRate("");
              setPace("");
            }}
            className="mt-4 w-full rounded-lg bg-aqua px-4 py-3 text-sm font-extrabold text-ink transition hover:bg-volt"
          >
            Save run
          </button>
          <div className="mt-5 space-y-2">
            {store.state.runLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-bold text-white">Day {log.day} · {log.type}</p>
                <p className="mt-1 text-sm text-steel">{log.duration} min · {log.distance} km · {log.heartRate ?? "--"} bpm · {log.pace || "--"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Weekly running plan</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {runDays.map((day) => (
            <div key={day.day} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold text-steel">Day {day.day} · {day.weekday}</p>
              <p className="mt-1 font-bold text-white">{day.title}</p>
              <p className="mt-1 text-sm text-steel">{day.notes}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
