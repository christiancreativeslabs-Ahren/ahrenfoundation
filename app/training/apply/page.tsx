import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingApplyPage from "@/components/sections/TrainingApplyPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Application - Ahren Foundation",
  description: "Apply for the Ahren Foundation 6-week tech and creativity masterclass program.",
};

export default function TrainingApply() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <TrainingApplyPage />
        <Footer />
      </>
    </PageTransition>
  );
}
