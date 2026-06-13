"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Download, Smartphone, Upload } from "lucide-react";
import { defaultSettings, useAthleteStore } from "@/lib/athleteStore";
import { buildBackupJson, parseBackupJson } from "@/lib/persistence";
import { Card, Field, PageHeader, Pill } from "@/components/ui";

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

export function SettingsView() {
  const store = useAthleteStore();
  const settings = store.state.settings;
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string>("");

  const exportBackup = () => {
    const json = buildBackupJson(store.state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `race-engine-40-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file?: File) => {
    if (!file) return;

    try {
      const raw = await file.text();
      const restored = parseBackupJson(raw);
      store.importState(restored);
      setImportMessage("Backup restored. Auto-save is writing it to this device now.");
    } catch {
      setImportMessage("Could not import that file. Choose a valid Race Engine JSON backup.");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  return (
    <>
      <PageHeader eyebrow="Plan controls" title="Settings" subtitle="Tune the baseline without touching the seeded training plan. Data is saved locally on this phone with no backend or login." />
      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ember/30 bg-ember/10">
                <AlertTriangle className="h-5 w-5 text-ember" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">Local data warning</p>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-steel">
                  Your check-ins, metrics, run logs, station times, and checklist are stored only on this phone in IndexedDB, with localStorage as a fallback. There is no backend, no account, and no login. If you clear browser/PWA storage, switch phones, or delete the app, export a backup first.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Pill tone={store.storageProvider === "indexeddb" ? "aqua" : "ember"}>{store.storageProvider}</Pill>
              <Pill tone={store.saveStatus === "saved" ? "volt" : store.saveStatus === "error" ? "ember" : "neutral"}>
                {store.saveStatus === "saving" ? "Auto-saving" : store.saveStatus === "saved" ? "Saved" : store.saveStatus === "error" ? "Save issue" : "Ready"}
              </Pill>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Dates</p>
          <div className="mt-4 grid gap-3">
            <Field label="Countdown start" value={settings.startDate} type="date" onChange={(value) => store.updateSettings({ startDate: value })} />
            <Field label="Race date" value={settings.raceDate} type="date" onChange={(value) => store.updateSettings({ raceDate: value })} />
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Body targets</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Starting weight" suffix="kg" value={settings.startingWeight} step={0.1} onChange={(value) => store.updateSettings({ startingWeight: toNumber(value) ?? settings.startingWeight })} />
            <Field label="Goal weight" suffix="kg" value={settings.goalWeight} step={0.1} onChange={(value) => store.updateSettings({ goalWeight: toNumber(value) ?? settings.goalWeight })} />
            <Field label="Starting waist" suffix="in" value={settings.startingWaist} step={0.1} onChange={(value) => store.updateSettings({ startingWaist: toNumber(value) ?? settings.startingWaist })} />
            <Field label="Goal waist" suffix="in" value={settings.goalWaist} step={0.1} onChange={(value) => store.updateSettings({ goalWaist: toNumber(value) ?? settings.goalWaist })} />
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Steps and units</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Base steps" value={settings.baseSteps} onChange={(value) => store.updateSettings({ baseSteps: toNumber(value) ?? settings.baseSteps })} />
            <Field label="Weekly increase" value={settings.stepIncrement} onChange={(value) => store.updateSettings({ stepIncrement: toNumber(value) ?? settings.stepIncrement })} />
          </div>
          <p className="mt-4 text-sm text-steel">Units are fixed to kg, inches, and kilometers for this version.</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-steel">Data controls</p>
          <div className="mt-3 flex items-start gap-3 rounded-lg border border-aqua/20 bg-aqua/10 p-3">
            <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
            <p className="text-sm leading-6 text-steel">The PWA keeps data after closing and reopening on this same phone. Use backups before clearing site data or moving devices.</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={exportBackup}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-aqua px-4 py-3 text-sm font-extrabold text-ink transition hover:bg-volt"
            >
              <Download className="h-4 w-4" />
              Export Backup
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-ink"
            >
              <Upload className="h-4 w-4" />
              Import Backup
            </button>
            <input
              ref={importInputRef}
              className="hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => importBackup(event.target.files?.[0])}
            />
          </div>
          {importMessage ? <p className="mt-3 text-sm text-steel">{importMessage}</p> : null}
          <p className="mt-5 text-sm leading-6 text-steel">Reset clears check-ins, run logs, station logs, and checklist state. Seeded plan data remains in code.</p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all local dashboard data?")) store.resetAll();
            }}
            className="mt-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-bold text-ember transition hover:bg-ember hover:text-white"
          >
            Reset local data
          </button>
          <button
            type="button"
            onClick={() => store.updateSettings(defaultSettings)}
            className="ml-3 mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-ink"
          >
            Restore defaults
          </button>
        </Card>
      </div>
    </>
  );
}
