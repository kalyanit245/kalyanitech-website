import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "kt-theme";

export const applyStoredTheme = () => {
  document.documentElement.classList.toggle("dark", localStorage.getItem(STORAGE_KEY) === "dark");
};

export const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem(STORAGE_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      data-testid="theme-toggle"
      onClick={() => setDark((v) => !v)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed bottom-6 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel text-foreground shadow-lg transition-transform duration-200 hover:scale-110"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
