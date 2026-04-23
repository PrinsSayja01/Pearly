import { create } from "zustand";

export const usePhase1Store = create((set) => ({
  step: "input",
  task: "",
  setup: { date: "", location: "" },
  candidates: [],

  setStep: (step) => set({ step }),
  setTask: (task) => set({ task }),
  setSetup: (partial) =>
    set((s) => ({ setup: { ...s.setup, ...partial } })),
  setCandidates: (candidates) => set({ candidates }),
}));
