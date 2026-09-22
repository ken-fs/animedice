"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { href: "/codes/", label: "Codes" },
  { href: "/units/", label: "Units" },
  { href: "/grades/", label: "Grades" },
  { href: "/dice/", label: "Dice" },
  { href: "/traits/", label: "Traits" },
  { href: "/mutations/", label: "Mutations" },
  { href: "/guide/", label: "Guide" },
];

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header className="sticky top-0 z-40 border-b rule bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <DieMark />
          <span className="text-sm font-semibold tracking-tight">Anime Dice</span>
        </Link>

        {/* Desktop: single line, 7 items, no wrap. Collapses to a sheet below lg. */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "rounded-[var(--radius-control)] px-3 py-1.5 text-sm transition-colors " +
                (isActive(l.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden rounded-[var(--radius-control)] sm:inline-flex"
          >
            <a href="https://www.roblox.com/games/113290951185459/Anime-Dice" target="_blank" rel="noopener">
              Play on Roblox
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-[var(--radius-control)] lg:hidden"
                aria-label="Open menu"
              >
                <List size={18} weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="px-4 pt-4 text-sm font-semibold">Menu</SheetTitle>
              <nav className="mt-4 flex flex-col px-2" aria-label="Mobile">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      "rounded-[var(--radius-container)] px-3 py-2.5 text-sm " +
                      (isActive(l.href)
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground")
                    }
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/**
 * Six-sided mark with the pip pattern of a real die face (5). Drawn once, used
 * once, and it reads as a die rather than a generic geometric logo blob.
 */
function DieMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.6" cy="8.6" r="1.35" fill="currentColor" />
      <circle cx="15.4" cy="8.6" r="1.35" fill="currentColor" />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" />
      <circle cx="8.6" cy="15.4" r="1.35" fill="currentColor" />
      <circle cx="15.4" cy="15.4" r="1.35" fill="currentColor" />
    </svg>
  );
}
