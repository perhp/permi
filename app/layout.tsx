import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("relative", GeistSans.className)}>{children}</body>
    </html>
  );
}
