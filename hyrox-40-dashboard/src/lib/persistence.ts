"use client";

import type { AthleteState } from "@/types/training";

const DB_NAME = "race-engine-40";
const DB_VERSION = 1;
const STORE_NAME = "app-state";
const STATE_KEY = "athlete-state";
const LOCAL_STORAGE_KEY = "race-engine-40-state-v1";

export type PersistenceProvider = "indexeddb" | "localstorage" | "memory";

export type PersistedRead = {
  state: Partial<AthleteState> | null;
  provider: PersistenceProvider;
};

function canUseIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open IndexedDB."));
  });
}

function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = action(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
        transaction.oncomplete = () => db.close();
        transaction.onerror = () => {
          db.close();
          reject(transaction.error ?? new Error("IndexedDB transaction failed."));
        };
      }),
  );
}

function readLocalStorage(): Partial<AthleteState> | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalStorage(state: AthleteState) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export async function readPersistedState(): Promise<PersistedRead> {
  if (typeof window === "undefined") return { state: null, provider: "memory" };

  try {
    const indexedState = await withStore<Partial<AthleteState> | undefined>("readonly", (store) => store.get(STATE_KEY));
    if (indexedState) return { state: indexedState, provider: "indexeddb" };

    const localState = readLocalStorage();
    if (localState) {
      await withStore("readwrite", (store) => store.put(localState, STATE_KEY));
      return { state: localState, provider: "localstorage" };
    }

    return { state: null, provider: "indexeddb" };
  } catch {
    return { state: readLocalStorage(), provider: "localstorage" };
  }
}

export async function writePersistedState(state: AthleteState): Promise<PersistenceProvider> {
  if (typeof window === "undefined") return "memory";

  try {
    await withStore("readwrite", (store) => store.put(state, STATE_KEY));
    writeLocalStorage(state);
    return "indexeddb";
  } catch {
    writeLocalStorage(state);
    return "localstorage";
  }
}

export async function clearPersistedState(): Promise<PersistenceProvider> {
  if (typeof window === "undefined") return "memory";

  try {
    await withStore("readwrite", (store) => store.delete(STATE_KEY));
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    return "indexeddb";
  } catch {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    return "localstorage";
  }
}

export function buildBackupJson(state: AthleteState) {
  return JSON.stringify(
    {
      schema: "race-engine-40-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      state,
    },
    null,
    2,
  );
}

export function parseBackupJson(raw: string): Partial<AthleteState> {
  const parsed = JSON.parse(raw);
  if (parsed?.schema === "race-engine-40-backup" && parsed.state) {
    return parsed.state;
  }
  return parsed;
}
