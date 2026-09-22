"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

const KEY = "ad-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reads the class the head script already applied, so the button never
    // disagrees with the painted page.
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* private mode: the inline head script falls back to the OS setting */
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="rounded-[var(--radius-control)] text-muted-foreground"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Icon is withheld until mount so SSR and first paint agree. */}
      {mounted ? (
        dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />
      ) : (
        <span className="inline-block size-4" />
      )}
      <span className="text-xs">{mounted ? (dark ? "Light" : "Dark") : "Theme"}</span>
    </Button>
  );
}
