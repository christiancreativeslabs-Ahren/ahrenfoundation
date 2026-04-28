import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/components/sections/HomePage";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <HomePage />
        <Footer />
      </>
    </PageTransition>
  );
}
