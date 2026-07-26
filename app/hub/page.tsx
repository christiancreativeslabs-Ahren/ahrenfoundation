import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HubPage from "@/components/sections/HubPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ahren Hub — Your Gateway to our Global Community of Christian Creatives",
  description: "Ahren Hub is your gateway to our Youth Empowerment & Mentorship Programs. Join the 6-Week Tech & Creativity Mentorship or log in as a verified member.",
};

export default function Hub() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <HubPage />
        <Footer />
      </>
    </PageTransition>
  );
}
