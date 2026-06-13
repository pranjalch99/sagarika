"use client";

import { useState } from "react";
import { hyroxStations, simulationWorkouts } from "@/data/trainingPlan";
import { useAthleteStore } from "@/lib/athleteStore";
import { Card, Field, PageHeader, Pill } from "@/components/ui";

export function SimulationView() {
  const store = useAthleteStore();
  const [station, setStation] = useState(hyroxStations[0].station);
  const [time, setTime] = useState("");
  const [load, setLoad] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <>
      <PageHeader eyebrow="Mixed-modal practice" title="Simulation" subtitle="Practice stations, compromised running, and transitions. Record station times so improvement is visible instead of vibes-based." />
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Simulation progression</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {simulationWorkouts.map((sim) => (
                <div key={sim.day} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">Day {sim.day}: {sim.name}</p>
                    <Pill tone="ember">{sim.goal}</Pill>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-steel">{sim.detail}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Equipment alternatives</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {hyroxStations.map((item) => (
                <div key={item.station} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="font-bold text-white">{item.station}</p>
                  <p className="mt-1 text-sm text-steel">{item.primary}</p>
                  <p className="mt-1 text-xs text-steel/80">Alt: {item.secondary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Station time log</p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-steel">Station</span>
            <select className="metric-input" value={station} onChange={(event) => setStation(event.target.value)}>
              {hyroxStations.map((item) => <option key={item.station}>{item.station}</option>)}
            </select>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Time" value={time} type="text" onChange={setTime} />
            <Field label="Load" value={load} type="text" onChange={setLoad} />
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-steel">Notes</span>
            <textarea className="metric-input min-h-24 resize-none" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => {
              if (!time) return;
              store.addStationLog({ day: store.currentDay, station, time, load, notes });
              setTime("");
              setLoad("");
              setNotes("");
            }}
            className="mt-4 w-full rounded-lg bg-aqua px-4 py-3 text-sm font-extrabold text-ink transition hover:bg-volt"
          >
            Save station
          </button>
          <div className="mt-5 space-y-2">
            {store.state.stationLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-bold text-white">Day {log.day} · {log.station}</p>
                <p className="mt-1 text-sm text-steel">{log.time} · {log.load || "no load"} · {log.notes || "no notes"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
