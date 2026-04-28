import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ObjectivesPage from "@/components/sections/ObjectivesPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objectives — Ahren Foundation",
  description: "Eight Spirit-led objectives that define how we move from vision to Kingdom impact.",
};

export default function Objectives() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <ObjectivesPage />
        <Footer />
      </>
    </PageTransition>
  );
}
