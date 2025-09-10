import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const revalidate = 0; // Disable caching for dynamic data
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const groups = await prisma.group.findMany({
    where: { ownerId: session.user.id },
  });

  return new NextResponse(JSON.stringify(groups), { status: 200 });
}
