import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SigStore {
  sigMap: string;
    setSigMap: (sigMap: string) => void;
    
}
export const useSigStore = create<SigStore>()(
  devtools((set) => ({
    sigMap: "",
    setSigMap: (sigMap: string) => set({ sigMap }),
  }))
);