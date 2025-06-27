// src/store/useStore.ts
import { create } from 'zustand';

// Définition de l'interface pour l'état de notre store
interface MyState {
  count: number;
  message: string;
  increment: () => void;
  decrement: () => void;
  setMessage: (msg: string) => void;
}

// Création du store
export const useStore = create<MyState>((set) => ({
  // État initial
  count: 0,
  message: "Bonjour de Zustand !",

  // Fonctions pour modifier l'état (actions)
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setMessage: (msg: string) => set(() => ({ message: msg })),
}));