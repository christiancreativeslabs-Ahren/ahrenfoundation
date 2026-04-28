import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinPage from "@/components/sections/JoinPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join — Ahren Foundation",
  description: "Apply as a Creative Youth or become a Mentor with Ahren Foundation.",
};

export default function Join() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <JoinPage />
        <Footer />
      </>
    </PageTransition>
  );
}
