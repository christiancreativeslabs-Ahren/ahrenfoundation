import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnersPage from "@/components/sections/PartnersPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us — Ahren Foundation",
  description: "Partner with us as an individual, ministry, or corporate organisation to equip the next generation of young Christian creatives with skills, confidence, and spiritual foundation.",
};

export default function Partners() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <PartnersPage />
        <Footer />
      </>
    </PageTransition>
  );
}
