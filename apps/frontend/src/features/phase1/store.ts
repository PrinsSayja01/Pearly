import { create } from "zustand";

/* 🔥 SIMPLE AI DETECT (TEMP) */
export const detectProfession = (text: string) => {
  const input = text.toLowerCase();

  if (input.includes("pipe") || input.includes("leak") || input.includes("plumb")) {
    return { profession: "plumber", suggestions: ["pipe repair", "leak fixing"] };
  }

  if (input.includes("wire") || input.includes("electric")) {
    return { profession: "electrician", suggestions: ["wiring", "power setup"] };
  }

  if (input.includes("paint")) {
    return { profession: "painter", suggestions: ["wall painting"] };
  }

  return { profession: "technician", suggestions: ["general repair"] };
};

export type Phase1Step =
  | "input"
  | "setup"
  | "candidates"
  | "confirm"
  | "team"
  | "done";

interface Phase1State {
  step: Phase1Step;

  taskInput: string;

  detectedProfession: string;
  suggestions: string[];

  setup: {
    startDate: string;
    endDate: string;
    location: string;
  };

  selectedCandidateId: string | null;
  selectedCandidate: any | null;

  teamMemberIds: string[];

  setStep: (s: Phase1Step) => void;
  setTaskInput: (s: string) => void;
  setDetected: (p: string, s: string[]) => void;
  setSetup: (s: any) => void;

  selectCandidate: (id: string) => void;
  setSelectedCandidate: (c: any) => void;

  toggleTeamMember: (id: string) => void;
  reset: () => void;
}

export const usePhase1Store = create<Phase1State>((set) => ({
  step: "input",

  taskInput: "",

  detectedProfession: "",
  suggestions: [],

  setup: {
    startDate: "",
    endDate: "",
    location: "",
  },

  selectedCandidateId: null,
  selectedCandidate: null,

  teamMemberIds: [],

  setStep: (step) => {
    console.log("STEP →", step);
    set({ step });
  },

  setTaskInput: (taskInput) => set({ taskInput }),

  setDetected: (profession, suggestions) =>
    set({
      detectedProfession: profession,
      suggestions: suggestions || [],
    }),

  setSetup: (s) =>
    set((state) => ({
      setup: { ...state.setup, ...s },
    })),

  selectCandidate: (id) => set({ selectedCandidateId: String(id) }),

  setSelectedCandidate: (c) => set({ selectedCandidate: c }),

  toggleTeamMember: (id) =>
    set((state) => ({
      teamMemberIds: state.teamMemberIds.includes(id)
        ? state.teamMemberIds.filter((x) => x !== id)
        : [...state.teamMemberIds, id],
    })),

  reset: () =>
    set({
      step: "input",
      taskInput: "",
      detectedProfession: "",
      suggestions: [],
      setup: { startDate: "", endDate: "", location: "" },
      selectedCandidateId: null,
      selectedCandidate: null,
      teamMemberIds: [],
    }),
}));