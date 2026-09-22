"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Consent-gated Google Analytics.
 *
 * Nothing from Google is requested until the visitor accepts. The gtag script is
 * injected at runtime rather than rendered in the document, so a declined visit
 * makes zero third-party requests and carries no analytics cookies. That is the
 * difference between a banner and a real gate: a banner that loads the tracker
 * anyway is decoration.
 *
 * The stored choice is "accepted" or "declined". A returning visitor with either
 * value never sees the banner again.
 */

const KEY = "ad-consent";
const GA_ID = "G-2DH27T5NH6";

type Choice = "accepted" | "declined";

export function AnalyticsConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      // Private mode. Treat as undecided, which means no tracking.
    }

    if (stored === "accepted") {
      loadAnalytics();
      return;
    }
    if (stored === "declined") return;

    // Delay the banner so it does not compete with the first paint, and so a
    // visitor who bounces immediately is never tracked or interrupted.
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* the choice still applies for this page view */
    }
    setShow(false);
    if (choice === "accepted") loadAnalytics();
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t rule bg-card p-4 lift"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Analytics: </span>
          We use Google Analytics to see which pages get read. It sets cookies, so it stays
          off until you say yes.{" "}
          <Link href="/about/" className="underline underline-offset-2 hover:text-foreground">
            How we handle data
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-[var(--radius-control)] px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-[0.98]"
          >
            No thanks
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-[var(--radius-control)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  );
}

/** Injects gtag.js once. Safe to call repeatedly; the guard makes it a no-op. */
function loadAnalytics() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __adGaLoaded?: boolean; dataLayer?: unknown[] };
  if (w.__adGaLoaded) return;
  w.__adGaLoaded = true;

  w.dataLayer = w.dataLayer || [];
  // gtag pushes its arguments object rather than an array, which is what the
  // Google snippet does. Keep the same shape so the library reads it correctly.
  function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}
