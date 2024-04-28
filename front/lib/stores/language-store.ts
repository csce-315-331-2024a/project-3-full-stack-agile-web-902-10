import { createStore } from "zustand/vanilla";

export type LanguageState = {
  language: string;
};

export type LanguageActions = {
  setLanguage: (language: string) => void;
};

export type LanguageStore = LanguageState & LanguageActions;

export const defaultLanguageState: LanguageState = {
  language: "English",
};

export const createLanguageStore = (
  initState: LanguageState = defaultLanguageState
) => {
  return createStore<LanguageStore>((set) => ({
    ...initState,
    setLanguage: (language) => set(() => ({ language })),
  }));
};