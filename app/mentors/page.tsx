import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MentorsPage from "@/components/sections/MentorsPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Our Mentors — Ahren Foundation",
  description: "Our mentors and facilitators are Christian creatives, tech professionals, industry experts, entrepreneurs, and product builders investing in the next generation.",
};

export default function Mentors() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <MentorsPage />
        <Footer />
      </>
    </PageTransition>
  );
}
