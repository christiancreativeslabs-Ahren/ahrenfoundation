import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationFormPage from "@/components/sections/ApplicationFormPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply — 6-Weeks Tech & Creativity Masterclass | Ahren Foundation",
  description: "Apply for the Ahren Foundation 6-Weeks Tech & Creativity Masterclass Program on Creativity, Tech Skills & God's Purpose.",
};

export default function TrainingApply() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <ApplicationFormPage />
        <Footer />
      </>
    </PageTransition>
  );
}
