import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPage from "@/components/sections/AboutPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Ahren Foundation",
  description: "Who we are, our vision, mission, and anchor. Building the global network of Holy Spirit-led innovators.",
};

export default function About() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <AboutPage />
        <Footer />
      </>
    </PageTransition>
  );
}
