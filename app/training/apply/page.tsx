import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingApplyPage from "@/components/sections/TrainingApplyPage";
import PageTransition from "@/components/PageTransition";
import { getTrainingApplicationSettings } from "@/lib/application-settings";
import { isTrainingApplicationOpen } from "@/lib/application-settings.shared";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Application - Ahren Foundation",
  description: "Apply for the Ahren Foundation 6-week tech and creativity masterclass program.",
};

export default async function TrainingApply() {
  const settings = await getTrainingApplicationSettings();
  const isOpen = isTrainingApplicationOpen(settings);

  return (
    <PageTransition>
      <>
        <Navbar />
        <TrainingApplyPage
          isOpen={isOpen}
          closedTitle={settings.closedTitle}
          closedMessageHtml={settings.closedMessageHtml}
        />
        <Footer />
      </>
    </PageTransition>
  );
}
