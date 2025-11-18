import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Formatear mensajes para el frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      type: "text",
      direction: msg.direction,
      createdAt: msg.createdAt.toISOString(),
      attachments: [],
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, direction = "outbound" } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "El contenido del mensaje es requerido" },
        { status: 400 }
      );
    }

    // Verificar que la conversación existe
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversación no encontrada" },
        { status: 404 }
      );
    }

    // Crear el mensaje
    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        content: content.trim(),
        direction: direction,
      },
    });

    // Actualizar la fecha de actualización de la conversación
    await prisma.conversation.update({
      where: { id: params.id },
      data: {
        updatedAt: new Date(),
      },
    });

    // Formatear mensaje para el frontend
    const formattedMessage = {
      id: message.id,
      content: message.content,
      type: "text",
      direction: message.direction,
      createdAt: message.createdAt.toISOString(),
      attachments: [],
    };

    return NextResponse.json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
