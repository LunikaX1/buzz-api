import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/auth/auth-options";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const groupData = await request.json();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const createdGroup = await prisma.group.create({
    data: {
      name: groupData.name,
      ownerId: session.user.id,
    },
  });

  if (!createdGroup) {
    return new Response("Failed to create group", { status: 500 });
  }
  return new Response(JSON.stringify(createdGroup), { status: 201 });
}
