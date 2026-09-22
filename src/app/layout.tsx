import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { WebsiteJsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anime Dice codes, unit odds and grade odds",
    template: "%s | Anime Dice Reference",
  },
  description:
    "Every Anime Dice code, all 28 units with published roll odds, the nine grades with their real chances, and the eight-dice ladder. Fan-made, no invented numbers.",
  openGraph: {
    type: "website",
    siteName: "Anime Dice Reference",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets the theme before paint so a light page never flashes dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ad-theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <WebsiteJsonLd site={SITE_URL} name="Anime Dice Reference" />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t rule">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-medium">Anime Dice Reference</p>
            <p className="mt-2 text-sm text-muted-foreground">
              An independent player reference. Not affiliated with More &amp; More Games
              or Roblox Corporation. Game names and assets belong to their owners.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <Link href="/codes/" className="text-muted-foreground hover:text-foreground">
              Codes
            </Link>
            <Link href="/units/" className="text-muted-foreground hover:text-foreground">
              Units
            </Link>
            <Link href="/grades/" className="text-muted-foreground hover:text-foreground">
              Grades
            </Link>
            <Link href="/dice/" className="text-muted-foreground hover:text-foreground">
              Dice
            </Link>
            <Link href="/about/" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between border-t rule pt-6">
          <p className="text-xs text-muted-foreground">
            Odds and multipliers are community-measured. Confirm in game before spending.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
