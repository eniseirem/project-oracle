import type { Metadata, Viewport } from "next";

// Self-hosted fonts (bundled via npm, no Google Fonts network call needed at
// build or request time — important for a bar with unreliable wifi).
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/oxanium/500.css";
import "@fontsource/oxanium/600.css";
import "@fontsource/oxanium/700.css";
import "@fontsource/oxanium/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT ORACLE",
  description: "A private behavioral experiment.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07080a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="oracle-shell">
          <div className="scanline-sweep" aria-hidden="true" />
          {children}
        </div>
      </body>
    </html>
  );
}
