import Footer from "../_components/layout/footer";
import Header from "../_components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="scanlines pointer-events-none fixed inset-0 z-[1] opacity-50"
      />
      <div className="relative z-[2] flex min-h-screen flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
