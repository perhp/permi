import Footer from "../_components/layout/footer";
import Header from "../_components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
