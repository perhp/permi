import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "./_components/footer";
import Header from "./_components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weater Satellite Images",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
