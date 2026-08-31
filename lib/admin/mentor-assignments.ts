import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { mentorAssignments, programMembers } from "@/db/schema";

export type MentorAssignmentCandidate = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
};

export async function getMentorAssignmentCandidates(search?: string) {
  const trimmedSearch = search?.trim();

  const filters = [
    eq(programMembers.role, "mentor"),
    eq(programMembers.status, "verified_mentor"),
    trimmedSearch
      ? or(
          ilike(programMembers.fullName, `%${trimmedSearch}%`),
          ilike(programMembers.email, `%${trimmedSearch}%`),
          ilike(programMembers.currentStep, `%${trimmedSearch}%`)
        )
      : undefined,
  ].filter(Boolean);

  return db
    .select({
      id: programMembers.id,
      fullName: programMembers.fullName,
      email: programMembers.email,
      status: programMembers.status,
      currentStep: programMembers.currentStep,
    })
    .from(programMembers)
    .where(and(...filters))
    .orderBy(asc(programMembers.fullName));
}

export type MentorAssignmentMenteeCandidate = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
  assignedMentorName: string | null;
};

export async function getMentorAssignmentMenteeCandidates(search?: string) {
  const trimmedSearch = search?.trim();

  const filters = [
    eq(programMembers.role, "youth"),
    trimmedSearch
      ? or(
          ilike(programMembers.fullName, `%${trimmedSearch}%`),
          ilike(programMembers.email, `%${trimmedSearch}%`),
          ilike(programMembers.currentStep, `%${trimmedSearch}%`),
          ilike(programMembers.status, `%${trimmedSearch}%`)
        )
      : undefined,
  ].filter(Boolean);

  const mentees = await db
    .select({
      id: programMembers.id,
      fullName: programMembers.fullName,
      email: programMembers.email,
      status: programMembers.status,
      currentStep: programMembers.currentStep,
    })
    .from(programMembers)
    .where(and(...filters))
    .orderBy(asc(programMembers.fullName));

  const mentorAssignmentsRows = mentees.length
    ? await db
        .select({
          youthMemberId: mentorAssignments.youthMemberId,
          mentorName: programMembers.fullName,
        })
        .from(mentorAssignments)
        .innerJoin(
          programMembers,
          eq(programMembers.id, mentorAssignments.mentorMemberId)
        )
        .where(
          and(
            eq(mentorAssignments.status, "active"),
            inArray(
              mentorAssignments.youthMemberId,
              mentees.map((mentee) => mentee.id)
            )
          )
        )
        .orderBy(desc(mentorAssignments.assignedAt))
    : [];

  const activeMentorNameByYouthId = new Map<string, string>();
  for (const row of mentorAssignmentsRows) {
    if (!activeMentorNameByYouthId.has(row.youthMemberId)) {
      activeMentorNameByYouthId.set(row.youthMemberId, row.mentorName);
    }
  }

  return mentees.map((mentee) => ({
    ...mentee,
    assignedMentorName: activeMentorNameByYouthId.get(mentee.id) ?? null,
  }));
}
