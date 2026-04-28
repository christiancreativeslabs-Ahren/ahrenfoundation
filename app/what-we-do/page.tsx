import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatWeDoPage from "@/components/sections/WhatWeDoPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do — Ahren Foundation",
  description: "Free tech workshops, CCLabs, fellowship, mentorship and more — all powered by faith and purpose.",
};

export default function WhatWeDo() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <WhatWeDoPage />
        <Footer />
      </>
    </PageTransition>
  );
}
