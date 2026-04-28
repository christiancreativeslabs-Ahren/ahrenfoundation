import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactPage from "@/components/sections/ContactPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Ahren Foundation",
  description: "Get in touch with the Ahren Foundation team. We'd love to hear from you.",
};

export default function Contact() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <ContactPage />
        <Footer />
      </>
    </PageTransition>
  );
}
