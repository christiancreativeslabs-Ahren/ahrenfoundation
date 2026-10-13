import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import CommunityHubPage from "@/components/sections/CommunityHubPage";

export const metadata: Metadata = {
  title: "Community Hub — Ahren Foundation",
  description:
    "Your digital home for purpose, community, and opportunity. Join or log in to the Ahren Foundation community of Christian creatives.",
};

export default function Hub() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <CommunityHubPage />
        <Footer />
      </>
    </PageTransition>
  );
}
