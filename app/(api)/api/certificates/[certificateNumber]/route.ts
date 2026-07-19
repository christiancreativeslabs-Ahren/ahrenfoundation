import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { certificates, programMembers } from "@/db/schema";
import { createCertificatePdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ certificateNumber: string }> },
) {
  const { certificateNumber } = await context.params;

  const [record] = await db
    .select({
      certificate: certificates,
      member: programMembers,
    })
    .from(certificates)
    .innerJoin(programMembers, eq(programMembers.id, certificates.programMemberId))
    .where(eq(certificates.certificateNumber, certificateNumber))
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const issuedAt = new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
  }).format(record.certificate.issuedAt);

  const pdf = createCertificatePdf({
    name: record.member.fullName,
    certificateNumber: record.certificate.certificateNumber,
    issuedAt,
  });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${record.certificate.certificateNumber}.pdf"`,
    },
  });
}
