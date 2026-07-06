import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BecomeMentorPage from "@/components/sections/BecomeMentorPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Mentor — Ahren Foundation",
  description: "Mentor young Christian creatives. Your skills. Their future. Kingdom impact.",
  robots: { index: false, follow: false },
};

export default function BecomeMentor() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <BecomeMentorPage />
        <Footer />
      </>
    </PageTransition>
  );
}
