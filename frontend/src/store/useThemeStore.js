import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "luxury",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
