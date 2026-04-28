import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsPage from "@/components/sections/ProjectsPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Ahren Foundation | Building for the Kingdom",
  description: "WELLS and PrayNations — faith-based tech products built inside our Christian Creatives Labs.",
};

export default function Projects() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <ProjectsPage />
        <Footer />
      </>
    </PageTransition>
  );
}
