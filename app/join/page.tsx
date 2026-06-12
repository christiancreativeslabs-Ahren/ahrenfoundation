import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinPage from "@/components/sections/JoinPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join — Ahren Foundation",
  description: "Apply for the Ahren Foundation 9-Week Youth Mentorship Program on Creativity, Tech Skills & God's Purpose.",
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
