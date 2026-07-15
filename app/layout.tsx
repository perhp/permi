import { cn } from "@/lib/utils";
import { IBM_Plex_Mono, Space_Mono } from "next/font/google";

import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative font-sans",
          plexMono.variable,
          spaceMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
