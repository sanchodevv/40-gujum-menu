'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'uz' | 'ru' | 'en';

type LangStore = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'uz',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'gavhar-lang' }
  )
);
