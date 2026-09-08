import { EnergyMode } from "@/content/v6/types";

export const ENERGY_KEY = "ejpt-v6-energy";
const ENERGY_EVENT = "ejpt-v6-energy-change";

export function loadEnergy(): EnergyMode {
  if (typeof window === "undefined") return "normal";
  const v = window.localStorage.getItem(ENERGY_KEY);
  if (v === "low" || v === "normal" || v === "high") return v;
  return "normal";
}

export function saveEnergy(mode: EnergyMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENERGY_KEY, mode);
  window.dispatchEvent(new Event(ENERGY_EVENT));
}

export function subscribeEnergy(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ENERGY_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ENERGY_EVENT, onStoreChange);
  };
}
