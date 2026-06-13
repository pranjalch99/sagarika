"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { macroTargets, raceChecklist, trainingPlan } from "@/data/trainingPlan";
import type { AthleteState, DailyCheckIn, AppSettings, RunLog, StationLog } from "@/types/training";
import { clearPersistedState, type PersistenceProvider, readPersistedState, writePersistedState } from "@/lib/persistence";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const defaultSettings: AppSettings = {
  startDate: "2026-06-16",
  raceDate: "2026-07-25",
  startingWeight: 85,
  goalWeight: 81,
  startingWaist: 33,
  goalWaist: 31,
  baseSteps: 3000,
  stepIncrement: 1000,
  units: "metric",
};

export const defaultState: AthleteState = {
  settings: defaultSettings,
  checkIns: {},
  runLogs: [],
  stationLogs: [],
  raceChecklist: Object.fromEntries(raceChecklist.map((item) => [item, false])),
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getCurrentDay(settings: AppSettings) {
  const diff = Math.floor((parseDate(todayIso()).getTime() - parseDate(settings.startDate).getTime()) / MS_PER_DAY) + 1;
  return Math.min(40, Math.max(1, diff));
}

export function getDaysToRace(settings: AppSettings) {
  return Math.max(0, Math.ceil((parseDate(settings.raceDate).getTime() - parseDate(todayIso()).getTime()) / MS_PER_DAY));
}

export function getDayDate(settings: AppSettings, day: number) {
  const date = parseDate(settings.startDate);
  date.setDate(date.getDate() + day - 1);
  return date.toISOString().slice(0, 10);
}

export function normalizeState(input: Partial<AthleteState> | null): AthleteState {
  if (!input) return defaultState;
  return {
    settings: { ...defaultSettings, ...input.settings },
    checkIns: input.checkIns ?? {},
    runLogs: input.runLogs ?? [],
    stationLogs: input.stationLogs ?? [],
    raceChecklist: { ...defaultState.raceChecklist, ...input.raceChecklist },
  };
}

export function getCheckInForDay(state: AthleteState, day: number): DailyCheckIn {
  const planDay = trainingPlan[day - 1];
  const target = macroTargets[planDay.nutritionKey];
  const defaults: DailyCheckIn = {
    day,
    date: getDayDate(state.settings, day),
    completed: false,
    sectionCompletions: {},
    steps: planDay.stepTarget,
    calories: target.calories,
    protein: target.protein,
    carbs: target.carbs,
    fats: target.fats,
    fatigue: 4,
    soreness: 4,
    readiness: 7,
    sleep: 7.5,
  };
  return {
    ...defaults,
    ...state.checkIns[day],
    day,
    date: getDayDate(state.settings, day),
  };
}

export function useAthleteStore() {
  const [state, setState] = useState<AthleteState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [storageProvider, setStorageProvider] = useState<PersistenceProvider>("indexeddb");

  useEffect(() => {
    let active = true;

    readPersistedState()
      .then((result) => {
        if (!active) return;
        setState(normalizeState(result.state));
        setStorageProvider(result.provider);
      })
      .catch(() => {
        if (!active) return;
        setState(defaultState);
        setStorageProvider("memory");
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      let active = true;
      setSaveStatus("saving");

      writePersistedState(state)
        .then((provider) => {
          if (!active) return;
          setStorageProvider(provider);
          setSaveStatus("saved");
        })
        .catch(() => {
          if (active) setSaveStatus("error");
        });

      return () => {
        active = false;
      };
    }
    return undefined;
  }, [hydrated, state]);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    setState((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);

  const updateCheckIn = useCallback((day: number, patch: Partial<DailyCheckIn>) => {
    setState((current) => {
      const existing = getCheckInForDay(current, day);
      return {
        ...current,
        checkIns: {
          ...current.checkIns,
          [day]: { ...existing, ...patch, day, date: existing.date },
        },
      };
    });
  }, []);

  const toggleSection = useCallback((day: number, sectionId: string) => {
    setState((current) => {
      const existing = getCheckInForDay(current, day);
      const sectionCompletions = {
        ...existing.sectionCompletions,
        [sectionId]: !existing.sectionCompletions[sectionId],
      };
      const planDay = trainingPlan[day - 1];
      const completed = planDay.sections.every((section) => sectionCompletions[section.id]);
      return {
        ...current,
        checkIns: {
          ...current.checkIns,
          [day]: { ...existing, sectionCompletions, completed },
        },
      };
    });
  }, []);

  const addRunLog = useCallback((log: Omit<RunLog, "id">) => {
    setState((current) => ({ ...current, runLogs: [{ ...log, id: crypto.randomUUID() }, ...current.runLogs] }));
  }, []);

  const addStationLog = useCallback((log: Omit<StationLog, "id">) => {
    setState((current) => ({ ...current, stationLogs: [{ ...log, id: crypto.randomUUID() }, ...current.stationLogs] }));
  }, []);

  const toggleRaceChecklist = useCallback((item: string) => {
    setState((current) => ({ ...current, raceChecklist: { ...current.raceChecklist, [item]: !current.raceChecklist[item] } }));
  }, []);

  const resetAll = useCallback(() => {
    clearPersistedState().finally(() => setState(defaultState));
  }, []);

  const importState = useCallback((incoming: Partial<AthleteState>) => {
    setState(normalizeState(incoming));
  }, []);

  const selectors = useMemo(() => {
    const currentDay = getCurrentDay(state.settings);
    const daysToRace = getDaysToRace(state.settings);
    const currentCheckIn = getCheckInForDay(state, currentDay);
    const completedDays = Object.values(state.checkIns).filter((item) => item.completed).length;
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => Math.max(1, currentDay - index)).reverse();
    const weekCheckIns = lastSevenDays.map((day) => getCheckInForDay(state, day));
    const weekCompletion = weekCheckIns.filter((item) => item.completed).length / weekCheckIns.length;
    const stepCompliance = weekCheckIns.filter((item) => {
      const planDay = trainingPlan[item.day - 1];
      return (item.steps ?? 0) >= Math.max(1, planDay.stepTarget);
    }).length / weekCheckIns.length;
    const complianceScore = Math.round(((weekCompletion * 0.65) + (stepCompliance * 0.35)) * 100);
    const readinessScore = Math.round(Math.max(0, Math.min(100, ((currentCheckIn.readiness ?? 7) * 10) - ((currentCheckIn.fatigue ?? 4) - 4) * 5 - ((currentCheckIn.soreness ?? 4) - 4) * 3)));
    const sortedCheckIns = Object.values(state.checkIns).sort((a, b) => a.day - b.day);
    const warnings = buildWarnings(sortedCheckIns, state.settings, currentDay);
    return { currentDay, daysToRace, currentCheckIn, completedDays, complianceScore, readinessScore, warnings, weekCheckIns };
  }, [state]);

  return {
    state,
    hydrated,
    saveStatus,
    storageProvider,
    ...selectors,
    updateSettings,
    updateCheckIn,
    toggleSection,
    addRunLog,
    addStationLog,
    toggleRaceChecklist,
    resetAll,
    importState,
  };
}

function buildWarnings(checkIns: DailyCheckIn[], settings: AppSettings, currentDay: number) {
  const warnings: string[] = [];
  const recent = checkIns.filter((item) => item.day >= currentDay - 2 && item.day <= currentDay);
  if (recent.length >= 2 && recent.filter((item) => (item.fatigue ?? 0) >= 8).length >= 2) {
    warnings.push("Fatigue has been high for multiple days. Reduce the next session intensity by 30% and protect sleep.");
  }
  if (recent.length >= 2 && recent.filter((item) => (item.sleep ?? 8) < 6.5).length >= 2) {
    warnings.push("Sleep is below target. Keep the session, but trim high-RPE work.");
  }
  const weighted = checkIns.filter((item) => typeof item.weight === "number");
  if (weighted.length >= 2) {
    const latest = weighted[weighted.length - 1];
    const previous = weighted.find((item) => item.day <= latest.day - 7) ?? weighted[0];
    const weeklyRate = ((previous.weight ?? settings.startingWeight) - (latest.weight ?? settings.startingWeight)) / Math.max(1, (latest.day - previous.day) / 7);
    if (weeklyRate > 1.5) warnings.push("Weight is dropping faster than 1.5 kg/week. Add 150-200 kcal on training days.");
    if (latest.day >= 10 && weeklyRate < 0.5) warnings.push("Weight loss is slower than target. Tighten tracking, reduce rest-day carbs by 30g, or add 1,000 steps/day.");
  }
  return warnings;
}
