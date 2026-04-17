import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsPage from "@/components/sections/ProjectsPage";

export const metadata = {
  title: "Projects — Ahren Foundation | Building for the Kingdom",
  description: "Digital tools and platforms crafted at the intersection of faith and technology — born in our Christian Creatives Labs.",
};

export default function Projects() {
  return (
    <>
      <Navbar />
      <ProjectsPage />
      <Footer />
    </>
  );
}
