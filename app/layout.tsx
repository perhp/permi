import { GeistSans } from "geist/font/sans";
import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";
import "./globals.css";

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
