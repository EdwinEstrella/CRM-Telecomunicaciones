import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    // Construir where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Obtener conversaciones con relaciones
    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      take: limit,
    });

    // Formatear las conversaciones para el frontend
    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      channel: conv.channel,
      status: conv.status,
      lastMessageAt: conv.lastMessageAt?.toISOString() || conv.updatedAt.toISOString(),
      contact: {
        id: conv.contact.id,
        name: conv.contact.name,
        avatar: conv.contact.avatar || undefined,
      },
      assignedTo: conv.assignedTo
        ? {
            id: conv.assignedTo.id,
            name: conv.assignedTo.name,
          }
        : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: formattedConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

