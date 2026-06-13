export type TrainingType = "strength" | "zone2" | "long-run" | "simulation" | "recovery" | "taper" | "race";

export type Intensity = "REST" | "VERY LOW" | "LOW" | "MODERATE-LOW" | "MODERATE" | "LOW-MODERATE" | "MODERATE-HIGH" | "HIGH" | "RACE";

export type WorkoutSection = {
  id: string;
  title: string;
  detail: string;
  items?: string[];
  target?: string;
};

export type TrainingDay = {
  day: number;
  phase: "Build" | "Peak" | "Final Peak" | "Taper" | "Race Week" | "Race Day";
  weekday: string;
  type: TrainingType;
  intensity: Intensity;
  title: string;
  focus: string;
  stepTarget: number;
  nutritionKey: "training" | "rest" | "carb-load" | "race";
  sections: WorkoutSection[];
  notes: string;
};

export type MacroTarget = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type DailyCheckIn = {
  day: number;
  date: string;
  completed: boolean;
  sectionCompletions: Record<string, boolean>;
  weight?: number;
  waist?: number;
  steps?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  sleep?: number;
  fatigue?: number;
  soreness?: number;
  readiness?: number;
  notes?: string;
};

export type RunLog = {
  id: string;
  day: number;
  type: "Zone 2" | "Long Run" | "Compromised";
  duration: number;
  distance: number;
  pace?: string;
  heartRate?: number;
  notes?: string;
};

export type StationLog = {
  id: string;
  day: number;
  station: string;
  time: string;
  load?: string;
  notes?: string;
};

export type AppSettings = {
  startDate: string;
  raceDate: string;
  startingWeight: number;
  goalWeight: number;
  startingWaist: number;
  goalWaist: number;
  baseSteps: number;
  stepIncrement: number;
  units: "metric";
};

export type AthleteState = {
  settings: AppSettings;
  checkIns: Record<number, DailyCheckIn>;
  runLogs: RunLog[];
  stationLogs: StationLog[];
  raceChecklist: Record<string, boolean>;
};
