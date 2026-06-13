import type { MacroTarget, TrainingDay } from "@/types/training";

const warmup = {
  id: "warmup",
  title: "Warm-up",
  detail: "5 min row, bike, or brisk walk at RPE 3-4. Add leg swings, hip circles, inchworms, and two light ramp sets for the first lift.",
  items: ["Leg swings 15 each side", "Hip circles 10 each direction", "Inchworm x 5", "Ramp sets at 50% then 75% working load"],
};

const cooldown = {
  id: "cooldown",
  title: "Cool-down",
  detail: "5 min easy walk to bring heart rate below 100 bpm, then static stretching and two minutes of nasal breathing.",
  items: ["Walk or light jog 5 min", "Hold 3-4 stretches for 45-60s", "Foam roll the tightest 2-3 areas", "Breathing: 4s inhale, 6s exhale"],
};

const mobility = (detail: string) => ({
  id: "mobility",
  title: "Mobility",
  detail,
});

const strength = (id: string, title: string, detail: string, items: string[]) => ({
  id,
  title,
  detail,
  items,
});

const run = (detail: string, target?: string) => ({
  id: "run",
  title: "Running / Zone 2",
  detail,
  target,
});

const nutrition = (detail: string) => ({
  id: "nutrition",
  title: "Nutrition target",
  detail,
});

export const macroTargets: Record<"training" | "rest" | "carb-load" | "race", MacroTarget> = {
  training: { calories: 2400, protein: 190, carbs: 245, fats: 62 },
  rest: { calories: 2250, protein: 190, carbs: 155, fats: 68 },
  "carb-load": { calories: 2700, protein: 180, carbs: 360, fats: 45 },
  race: { calories: 2500, protein: 170, carbs: 320, fats: 45 },
};

export const strengthTemplates = {
  legs: [
    "Barbell Back Squat: 4 sets x 4-6 heavy into 8-10 back-off, RPE 8-8.5, rest 2 min",
    "Romanian Deadlift: 4 x 8-10, RPE 7.5-8, rest 90s",
    "Leg Press: 3 x 10-12, RPE 7-7.5, rest 90s",
    "Seated Leg Curl: 3 x 10-12, slow 3s eccentric, rest 75s",
    "Standing Calf Raise: 4 x 15-20, full ROM, rest 60s",
    "Optional Bulgarian Split Squat: 2 x 8 each, RPE 7",
  ],
  chest: [
    "Barbell Bench Press: 4 x 5-6 heavy into 8-10 back-off, RPE 8-8.5",
    "Overhead Press: 3 x 8-10, RPE 7.5-8",
    "Incline DB Press: 3 x 10-12, RPE 7-7.5",
    "Cable Lateral Raise: 3 x 12-15, RPE 7",
    "Face Pull: 3 x 15-20, RPE 7",
    "DB Rear Delt Fly: 3 x 12-15 if time allows",
  ],
  back: [
    "Deadlift: 3 x 5, RPE 8-8.5, rest 2-3 min",
    "Weighted Pull-up or Lat Pulldown: 4 x 6-8 or 10-12, RPE 8",
    "Seated Cable Row: 3 x 10-12 with 3s peak hold",
    "Single-arm DB Row: 3 x 10-12 each",
    "Face Pull: 3 x 15-20",
    "Band Pull-apart: 3 x 20",
  ],
  arms: [
    "Barbell Curl: 3 x 8-10, RPE 7.5",
    "Hammer Curl: 3 x 10-12, RPE 7",
    "Tricep Pushdown: 3 x 10-12, RPE 7.5",
    "Overhead Tricep Extension: 3 x 10-12, RPE 7",
    "Dead Bug: 3 x 10 each side",
    "Pallof Press: 3 x 12 each side",
    "Plank: 3 x 45-60s",
  ],
};

export const hyroxStations = [
  { station: "Ski Erg", primary: "Rope pull-down on cable machine", secondary: "Resistance band overhead pull x 30" },
  { station: "Sled Push", primary: "Barbell landmine push x 20m", secondary: "Plate push on smooth floor x 20m" },
  { station: "Sled Pull", primary: "Heavy towel sled drag", secondary: "Seated cable row with band x 20" },
  { station: "Rowing", primary: "Stationary bike at matched RPE", secondary: "50 cal assault bike" },
  { station: "Burpee Broad Jump", primary: "Burpee plus broad jump", secondary: "Burpee plus standing broad jump" },
  { station: "Wall Ball", primary: "DB thruster", secondary: "Goblet squat plus press" },
  { station: "Farmer Carry", primary: "DB farmer carry", secondary: "Trap bar carry" },
  { station: "Sandbag Lunges", primary: "DB walking lunges", secondary: "Weighted vest lunges" },
];

export const simulationWorkouts = [
  { day: 2, name: "Session A", goal: "Learn patterns", detail: "3 rounds: 200m jog, 10 wall balls, 100m farmer carry, 2 min rest. Add 3 x 10 burpee broad jumps." },
  { day: 9, name: "Session B", goal: "Volume increase", detail: "4 rounds: 200m run, 12 wall balls, 100m farmer carry, 200m run, 90s rest. Add 3 x 30s SkiErg substitute." },
  { day: 16, name: "Session C", goal: "Compromised running", detail: "3 rounds: 600m run at RPE 7, 15 wall balls, 100m farmer carry, immediately back to run." },
  { day: 23, name: "Session D", goal: "Build station volume", detail: "4 rounds: 800m run, 12 wall balls, 150m farmer carry, 50m lunge walk. Add 500m rowing substitute." },
  { day: 27, name: "Session E", goal: "60-70% race stress", detail: "6 rounds: 600m run, alternating stations: wall balls, farmer carry, lunges, burpees, row sub, sled sub." },
  { day: 30, name: "Session F", goal: "Final peak", detail: "5 rounds: 800m run, 2 stations per round, 15s max transitions. Smooth, controlled, no hero finish." },
];

export const raceChecklist = [
  "Bib and ID confirmed",
  "Race shoes tested",
  "Socks and kit packed",
  "Electrolytes packed",
  "Breakfast ingredients ready",
  "Caffeine plan ready",
  "Warm-up sequence reviewed",
  "Pacing cues reviewed",
  "Station strategy reviewed",
  "Post-race protein and carbs ready",
];

const days: Omit<TrainingDay, "sections">[] = [
  { day: 1, phase: "Build", weekday: "MON", type: "strength", intensity: "MODERATE-HIGH", title: "Legs", focus: "Strength + volume", stepTarget: 5000, nutritionKey: "training", notes: "Squat, RDL, leg press, leg curl, calf raise. RPE 7-8." },
  { day: 2, phase: "Build", weekday: "TUE", type: "simulation", intensity: "MODERATE", title: "HYROX Conditioning A", focus: "Station practice", stepTarget: 5000, nutritionKey: "training", notes: "Rowing, wall ball, farmer carry plus easy run practice." },
  { day: 3, phase: "Build", weekday: "WED", type: "zone2", intensity: "MODERATE-HIGH", title: "Chest + Shoulders", focus: "Push strength + easy run", stepTarget: 5000, nutritionKey: "training", notes: "Add 20 min Zone 2 run post-weights, HR 111-130 bpm." },
  { day: 4, phase: "Build", weekday: "THU", type: "strength", intensity: "MODERATE", title: "Back + Rear Delts", focus: "Pull strength", stepTarget: 5000, nutritionKey: "training", notes: "Deadlift, pull-up/pulldown, rows, face pulls, band pull-aparts." },
  { day: 5, phase: "Build", weekday: "FRI", type: "zone2", intensity: "MODERATE-LOW", title: "Arms + Core", focus: "Accessory + aerobic", stepTarget: 5000, nutritionKey: "training", notes: "20-25 min Zone 2 run. Keep HR under 130." },
  { day: 6, phase: "Build", weekday: "SAT", type: "simulation", intensity: "MODERATE-HIGH", title: "HYROX Session A", focus: "Compromised basics", stepTarget: 5000, nutritionKey: "training", notes: "4 x 400m run plus two stations. RPE 7. Do not blow up." },
  { day: 7, phase: "Build", weekday: "SUN", type: "long-run", intensity: "LOW", title: "Long Run", focus: "Aerobic base", stepTarget: 5000, nutritionKey: "training", notes: "35-40 min Zone 2. Run/walk is correct if HR drifts." },
  { day: 8, phase: "Build", weekday: "MON", type: "strength", intensity: "MODERATE-HIGH", title: "Legs Progression", focus: "Add load if ready", stepTarget: 5500, nutritionKey: "training", notes: "Increase load 5% from Day 1 if Day 1 felt below RPE 7.5." },
  { day: 9, phase: "Build", weekday: "TUE", type: "simulation", intensity: "MODERATE", title: "HYROX Conditioning B", focus: "Timed rounds", stepTarget: 5500, nutritionKey: "training", notes: "4 rounds: 200m run, 10 wall balls, 100m farmer carry, 200m run." },
  { day: 10, phase: "Build", weekday: "WED", type: "zone2", intensity: "MODERATE-HIGH", title: "Chest + Shoulders", focus: "Push progression", stepTarget: 5500, nutritionKey: "training", notes: "Add one set to primary compound if last week felt easy." },
  { day: 11, phase: "Build", weekday: "THU", type: "strength", intensity: "MODERATE", title: "Back + Rear Delts", focus: "Pull progression", stepTarget: 6000, nutritionKey: "training", notes: "Add deadlift weight if RPE was below 7." },
  { day: 12, phase: "Build", weekday: "FRI", type: "zone2", intensity: "MODERATE-LOW", title: "Arms + Core", focus: "Longer Zone 2", stepTarget: 6000, nutritionKey: "training", notes: "25 min Zone 2. Walk if HR drifts." },
  { day: 13, phase: "Build", weekday: "SAT", type: "simulation", intensity: "HIGH", title: "HYROX Session B", focus: "Volume build", stepTarget: 6000, nutritionKey: "training", notes: "5 x 400m run plus two stations. Time rounds and track HR." },
  { day: 14, phase: "Build", weekday: "SUN", type: "long-run", intensity: "LOW", title: "Long Run", focus: "40-45 min easy", stepTarget: 6000, nutritionKey: "training", notes: "HR cap 135. Refuel well and weigh in tomorrow morning." },
  { day: 15, phase: "Peak", weekday: "MON", type: "strength", intensity: "HIGH", title: "Legs + Weekly Check-in", focus: "RPE 8 main lifts", stepTarget: 6000, nutritionKey: "training", notes: "Weigh in, check performance, adjust nutrition only if trend requires it." },
  { day: 16, phase: "Peak", weekday: "TUE", type: "simulation", intensity: "MODERATE-HIGH", title: "HYROX Conditioning C", focus: "Compromised running", stepTarget: 6500, nutritionKey: "training", notes: "3 rounds: 600m run, 15 wall balls, 100m farmer carry, back to run." },
  { day: 17, phase: "Peak", weekday: "WED", type: "zone2", intensity: "MODERATE", title: "Chest + Shoulders", focus: "Maintain load", stepTarget: 6500, nutritionKey: "training", notes: "No PR attempts. Add 20 min Zone 2 run." },
  { day: 18, phase: "Peak", weekday: "THU", type: "strength", intensity: "MODERATE", title: "Back + Rear Delts", focus: "Heavy pull", stepTarget: 6500, nutritionKey: "training", notes: "Weighted pull-ups or heavy pulldown. Keep loads from week 2." },
  { day: 19, phase: "Peak", weekday: "FRI", type: "zone2", intensity: "LOW", title: "Arms + Core", focus: "Easy accessory", stepTarget: 6500, nutritionKey: "rest", notes: "25-30 min Zone 2 run. Protect the evening for rest." },
  { day: 20, phase: "Peak", weekday: "SAT", type: "simulation", intensity: "HIGH", title: "HYROX Simulation A", focus: "6 x run + station", stepTarget: 6500, nutritionKey: "training", notes: "6 x 400m run plus station. Track total time. RPE 7.5." },
  { day: 21, phase: "Peak", weekday: "SUN", type: "long-run", intensity: "LOW", title: "Long Run", focus: "45-50 min Zone 2", stepTarget: 6500, nutritionKey: "training", notes: "Never race the long run. Slightly higher carbs, lower fat." },
  { day: 22, phase: "Peak", weekday: "MON", type: "strength", intensity: "MODERATE-HIGH", title: "Legs Deload Signal Check", focus: "Maintain or trim volume", stepTarget: 7000, nutritionKey: "training", notes: "If fatigue is high, reduce sets by one per exercise and maintain load." },
  { day: 23, phase: "Peak", weekday: "TUE", type: "simulation", intensity: "MODERATE-HIGH", title: "HYROX Conditioning D", focus: "Longer compromised run", stepTarget: 7000, nutritionKey: "training", notes: "4 rounds: 800m run, 12 wall balls, 150m farmer carry." },
  { day: 24, phase: "Peak", weekday: "WED", type: "zone2", intensity: "MODERATE", title: "Chest + Shoulders", focus: "Same load", stepTarget: 7000, nutritionKey: "training", notes: "Add push-up finisher. Include 20 min Zone 2 run." },
  { day: 25, phase: "Peak", weekday: "THU", type: "strength", intensity: "MODERATE", title: "Back + Rear Delts", focus: "Tempo rows", stepTarget: 7000, nutritionKey: "training", notes: "Keep lifts same or slightly heavier. Emphasize 3s eccentric rows." },
  { day: 26, phase: "Peak", weekday: "FRI", type: "zone2", intensity: "LOW", title: "Arms + Core", focus: "Best aerobic day", stepTarget: 7000, nutritionKey: "rest", notes: "30 min Zone 2. Early night before big Saturday." },
  { day: 27, phase: "Peak", weekday: "SAT", type: "simulation", intensity: "HIGH", title: "HYROX Simulation B", focus: "Longer 60-70% race stress", stepTarget: 7500, nutritionKey: "training", notes: "6 x 600m run plus station. Finish all stations without stopping." },
  { day: 28, phase: "Peak", weekday: "SUN", type: "long-run", intensity: "LOW", title: "Longest Long Run", focus: "50-55 min Zone 2", stepTarget: 7500, nutritionKey: "training", notes: "Manage this carefully. Full body foam roll 25 min." },
  { day: 29, phase: "Final Peak", weekday: "MON", type: "strength", intensity: "HIGH", title: "Legs + Weekly Check-in", focus: "Maintain all loads", stepTarget: 8000, nutritionKey: "training", notes: "RPE 8 hard but achievable. Reduce rest-day carbs only if behind." },
  { day: 30, phase: "Final Peak", weekday: "TUE", type: "simulation", intensity: "HIGH", title: "HYROX Conditioning E", focus: "Hardest session", stepTarget: 8000, nutritionKey: "training", notes: "5 rounds: 800m run, 15 wall balls, 200m farmer carry. No deficit today." },
  { day: 31, phase: "Taper", weekday: "WED", type: "taper", intensity: "MODERATE", title: "Begin Taper: Chest + Shoulders", focus: "Reduced sets", stepTarget: 6500, nutritionKey: "training", notes: "3 sets per exercise. Maintain load. No PRs." },
  { day: 32, phase: "Taper", weekday: "THU", type: "taper", intensity: "MODERATE-LOW", title: "Taper: Back + Rear Delts", focus: "No deadlift", stepTarget: 6000, nutritionKey: "rest", notes: "Pull-ups, rows, face pulls only. Three sets each." },
  { day: 33, phase: "Taper", weekday: "FRI", type: "taper", intensity: "LOW", title: "Taper: Arms", focus: "Last Zone 2 run", stepTarget: 6000, nutritionKey: "carb-load", notes: "RPE 6.5. 15-20 min easy jog. Start slightly increasing carbs." },
  { day: 34, phase: "Taper", weekday: "SAT", type: "taper", intensity: "LOW-MODERATE", title: "Taper: Legs", focus: "Reduce load 10%", stepTarget: 6000, nutritionKey: "carb-load", notes: "Squat, RDL, leg press only. No lunges." },
  { day: 35, phase: "Taper", weekday: "SUN", type: "long-run", intensity: "VERY LOW", title: "Easy Run", focus: "25-30 min conversational", stepTarget: 6000, nutritionKey: "carb-load", notes: "Last long-ish run. Must feel easy." },
  { day: 36, phase: "Race Week", weekday: "MON", type: "taper", intensity: "VERY LOW", title: "Light Full Body Activation", focus: "Move only", stepTarget: 7000, nutritionKey: "carb-load", notes: "2 x 8: goblet squat, push-up, band pull-apart, KB swing. RPE 5." },
  { day: 37, phase: "Race Week", weekday: "TUE", type: "taper", intensity: "LOW", title: "Short Sharpener", focus: "3 x 200m race pace", stepTarget: 6000, nutritionKey: "carb-load", notes: "Feel sharp, not tired. Hydrate aggressively." },
  { day: 38, phase: "Race Week", weekday: "WED", type: "recovery", intensity: "REST", title: "Complete Rest", focus: "Walk only", stepTarget: 5000, nutritionKey: "carb-load", notes: "Sodium loading begins. Light yoga only." },
  { day: 39, phase: "Race Week", weekday: "THU", type: "taper", intensity: "VERY LOW", title: "Race Eve Activation", focus: "15 min total", stepTarget: 4000, nutritionKey: "carb-load", notes: "2 sets: squat, push-up, plank 30s, calf raise. Then stop." },
  { day: 40, phase: "Race Day", weekday: "FRI", type: "race", intensity: "RACE", title: "Race Day", focus: "Execute", stepTarget: 0, nutritionKey: "race", notes: "Race day execution. Controlled aggression. First third settle, second maintain, final attack." },
];

function sectionsFor(day: Omit<TrainingDay, "sections">): TrainingDay["sections"] {
  const lower = day.title.toLowerCase();
  if (day.type === "race") {
    return [
      { id: "timeline", title: "Race morning", detail: "Wake 3.5h before start. Hydrate with 500ml water + electrolytes. Eat tested breakfast 3h out. Caffeine 45 min out.", items: ["100g oats + banana + 2 eggs + juice", "Gear and bib check", "10 min walk + dynamic warm-up", "Review pacing cues"] },
      { id: "pacing", title: "Pacing strategy", detail: "Runs 1-4 feel easy, runs 5-8 progressively build. Do not race the first half.", items: ["Run 1-2: 6:30-7:00/km", "Run 3-4: 6:45-7:15/km", "Run 5-6: 6:15-7:00/km", "Run 7-8: attack with control"] },
      cooldown,
    ];
  }
  if (day.type === "simulation") {
    const sim = simulationWorkouts.find((item) => item.day === day.day) ?? simulationWorkouts.find((item) => day.title.includes(item.name));
    return [warmup, { id: "main", title: day.title, detail: sim?.detail ?? day.notes, target: day.focus, items: ["Track total time", "Record station loads", "Keep transitions deliberate", "Stop only if form breaks"] }, run(day.notes), mobility("20 min full mobility on simulation days: hips, thoracic spine, ankles, calves."), nutrition("Training day macros. Add electrolytes and 500mg sodium before harder HYROX sessions."), cooldown];
  }
  if (day.type === "long-run") {
    return [warmup, run(day.notes, day.focus), mobility("Full body stretch and foam roll. Prioritize calves, quads, hip flexors, and feet."), nutrition(day.nutritionKey === "carb-load" ? "Carb-load day. Keep protein steady, reduce fats, avoid high-fiber experiments." : "Slightly higher carbs to replenish glycogen. Protein remains 180-195g."), cooldown];
  }
  if (day.type === "taper" || day.type === "recovery") {
    return [warmup, { id: "main", title: day.title, detail: day.notes, target: day.focus }, mobility("Keep mobility easy. Leave every session feeling better than you started."), nutrition(day.nutritionKey === "carb-load" ? "Carb loading: 320-400g carbs depending on the day. Maintain protein and add sodium from Day 37." : "Keep protein high. Do not create extra fatigue with an aggressive deficit."), cooldown];
  }
  if (lower.includes("leg")) {
    return [warmup, strength("main", day.title, day.notes, strengthTemplates.legs), run(day.type === "zone2" ? day.notes : "Steps only today unless the plan calls for a run.", day.focus), mobility("Hip flexor stretch, quad stretch, pigeon pose, calf stretch. 10-20 min."), nutrition("Training day macros. Pre-workout: 60g carbs + 30g protein. Post: 50g carbs + 40g protein."), cooldown];
  }
  if (lower.includes("chest")) {
    return [warmup, strength("main", day.title, day.notes, strengthTemplates.chest), run("20 min Zone 2 run post-lift. HR 111-133 bpm, very easy pace.", day.focus), mobility("Calf stretch, thoracic rotation, shoulder mobility."), nutrition("Moderate carbs. Keep protein 180-195g and protect sleep."), cooldown];
  }
  if (lower.includes("back")) {
    return [warmup, strength("main", day.title, day.notes, strengthTemplates.back), run("Steps and walking only unless needed for active recovery.", day.focus), mobility("Lat stretch, thoracic spine mobility, shoulder CARs, wall angels."), nutrition("Moderate carbs. Protein priority day."), cooldown];
  }
  return [warmup, strength("main", day.title, day.notes, strengthTemplates.arms), run(day.type === "zone2" ? "20-30 min Zone 2 run. Walk if HR drifts above cap." : "Optional easy walk only.", day.focus), mobility("Foam roll full body. Calves and IT band focus on run days."), nutrition("Lower-carb training day. Prepare glycogen for the next hard session."), cooldown];
}

export const trainingPlan: TrainingDay[] = days.map((day) => ({
  ...day,
  sections: sectionsFor(day),
}));

export const runningProgression = [
  { week: "Week 1", duration: "35-40 min", hr: "112-125 bpm", note: "Very easy, run/walk OK. Never exceed 135 bpm." },
  { week: "Week 2", duration: "40-45 min", hr: "112-128 bpm", note: "Slightly more running, still walk when needed." },
  { week: "Week 3", duration: "45-50 min", hr: "115-130 bpm", note: "Continuous jog OK if HR stays controlled." },
  { week: "Week 4", duration: "50-55 min", hr: "115-130 bpm", note: "Longest long run. Focus HR, not pace." },
  { week: "Taper", duration: "25-30 min", hr: "110-125 bpm", note: "Last real long run. Finish fresh." },
];

export const taperCarbs = [
  { day: 34, carbs: "300-320g", note: "Start loading. Normal protein, lower fat." },
  { day: 35, carbs: "340-360g", note: "Easy run depletes, then refill." },
  { day: 36, carbs: "380-400g", note: "Full load day: rice, potato, oats, banana." },
  { day: 37, carbs: "350-370g", note: "Maintain. Add sodium." },
  { day: 38, carbs: "330-350g", note: "Rest day. Load continues." },
  { day: 39, carbs: "320-340g", note: "Easy-to-digest carbs only." },
  { day: 40, carbs: "80-100g pre-race", note: "Race breakfast only. Use tested foods." },
];
