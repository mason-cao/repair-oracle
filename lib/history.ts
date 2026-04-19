"use client";

import type { Diagnosis } from "./diagnosis";

export type HistoryEntry = {
  id: string;
  createdAt: number;
  image: string; // data URL, downscaled
  category: string;
  symptom: string;
  diagnosis: Diagnosis;
};

const KEY = "repair-oracle.history";
const MAX_ENTRIES = 20;
const MAX_THUMB_SIZE = 520;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry) {
  if (typeof window === "undefined") return;
  const current = loadHistory();
  const next = [entry, ...current.filter((e) => e.id !== entry.id)].slice(
    0,
    MAX_ENTRIES
  );
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // likely quota exceeded — trim harder
    try {
      localStorage.setItem(KEY, JSON.stringify(next.slice(0, 5)));
    } catch {
      // give up
    }
  }
}

export function removeHistory(id: string) {
  const current = loadHistory();
  localStorage.setItem(
    KEY,
    JSON.stringify(current.filter((e) => e.id !== id))
  );
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export async function downscaleImage(dataUrl: string): Promise<string> {
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, MAX_THUMB_SIZE / Math.max(img.width, img.height));
    if (scale >= 1 && dataUrl.length < 400_000) return dataUrl;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    return dataUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
