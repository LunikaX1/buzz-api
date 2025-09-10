import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/auth/auth-options";
import { Group } from "@/generated/prisma";
import { GroupCreate } from "@/components/group-create";
import GroupList from "@/components/group-list";

export const revalidate = 0 // Disable caching for dynamic data
export default async function Project() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  //with type of project
  const projects: Group[] = await prisma.group.findMany({
    where: { ownerId: session.user.id },
    include: { owner: true },
  });

  if (projects.length === 0) {
    return <GroupCreate />;
  } else {
    return <GroupList groups={projects} />;
  }
}
