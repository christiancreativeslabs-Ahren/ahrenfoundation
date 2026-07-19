import { createMentorGuidelinesPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pdf = createMentorGuidelinesPdf();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="ahren-mentor-guidelines.pdf"',
    },
  });
}
