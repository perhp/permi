import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("relative", GeistSans.className)}>
        <Header />
        <Meteors number={20} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
