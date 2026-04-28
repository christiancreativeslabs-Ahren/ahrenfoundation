import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/sections/BlogPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Ahren Foundation",
  description: "Stories, reflections, and insights from the intersection of faith, creativity, and technology.",
};

export default function Blog() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <BlogPage />
        <Footer />
      </>
    </PageTransition>
  );
}
