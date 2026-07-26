import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CitiReachPage from "@/components/sections/CitiReachPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CitiReach — Street Gospel Initiative | Ahren Foundation",
  description: "United believers, different churches, one mission — taking the Gospel to the streets. Join the quarterly CitiReach outreach.",
};

export default function CitiReach() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <CitiReachPage />
        <Footer />
      </>
    </PageTransition>
  );
}
