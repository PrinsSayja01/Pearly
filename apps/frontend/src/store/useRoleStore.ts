import { create } from "zustand";

export type Role = "client" | "worker" | "supervisor" | "coordinator";

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: "supervisor",
  setRole: (role) => set({ role }),
}));
