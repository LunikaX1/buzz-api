import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0; // Disable caching for dynamic data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // changed: params is a Promise
) {
  const { id: projectId } = await params; // changed: await params and destructure

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const group = await prisma.group.findUnique({
      where: { id: projectId },
    });

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    if (group.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
