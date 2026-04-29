import { create } from "zustand";

/* 🔥 STRICT PROFESSION DETECTION */
export const detectProfession = (text: string) => {
  const input = text.toLowerCase();

  if (/(roof|leak.*roof|roof repair)/.test(input))
    return { profession: "roofer", suggestions: ["carpenter"] };

  if (/(pipe|leak|water|bathroom)/.test(input))
    return { profession: "plumber", suggestions: ["helper"] };

  if (/(electric|wire|power)/.test(input))
    return { profession: "electrician", suggestions: ["helper"] };

  if (/(paint|wall color)/.test(input))
    return { profession: "painter", suggestions: ["tiler"] };

  if (/(tile|floor tile)/.test(input))
    return { profession: "tiler", suggestions: ["painter"] };

  if (/(clean|dust|wash)/.test(input))
    return { profession: "cleaner", suggestions: [] };

  if (/(wood|door|furniture)/.test(input))
    return { profession: "carpenter", suggestions: ["roofer"] };

  return { profession: "", suggestions: [] };
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

  setStep: (step) => set({ step }),
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

  selectCandidate: (id) =>
    set({ selectedCandidateId: String(id) }),

  setSelectedCandidate: (c) =>
    set({ selectedCandidate: c }),

  toggleTeamMember: (id) =>
    set((state) => {
      const strId = String(id);
      return {
        teamMemberIds: state.teamMemberIds.includes(strId)
          ? state.teamMemberIds.filter((x) => x !== strId)
          : [...state.teamMemberIds, strId],
      };
    }),

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