import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JoinPage from "@/components/sections/JoinPage";
import PageTransition from "@/components/PageTransition";
import { auth } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Join - Ahren Foundation",
  description:
    "Apply as a Creative Youth or become a Mentor with Ahren Foundation.",
};

export const dynamic = "force-dynamic";

export default async function Join() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <PageTransition>
      <>
        <Navbar />
        <JoinPage
          prefilledEmail={session?.user?.email ?? null}
          prefilledName={session?.user?.name ?? null}
        />
        <Footer />
      </>
    </PageTransition>
  );
}
