import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "WATT.DEV",
    template: "%s | WATT.DEV",
  },
  description: "Portfolio และบล็อกส่วนตัวของ Watthanatham Kruram",
};

// Default theme is light — only go dark if the visitor explicitly chose it
// before. We intentionally do NOT follow the OS prefers-color-scheme.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

// Default is "formal" (no stored value needed) — matches the server-rendered
// default in src/lib/use-mode.ts, so there is nothing to flip on first paint
// unless the visitor previously switched to game mode.
const MODE_INIT_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem('mode') === 'game') {
      document.documentElement.dataset.mode = 'game';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: MODE_INIT_SCRIPT }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
          attributes onto <body> before React hydrates. It only applies one
          level deep, so <html> having it does not cover <body>. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
