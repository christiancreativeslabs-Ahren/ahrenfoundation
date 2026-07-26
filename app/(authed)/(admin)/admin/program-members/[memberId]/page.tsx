import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { programMembers } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function ProgramMemberRedirectPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const [member] = await db
    .select({
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  redirect(
    member?.joinApplicationId
      ? `/admin/join-applications/${member.joinApplicationId}`
      : "/admin/join-applications",
  );
}
