import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;

    // Verificar que el ticket esté asignado al técnico actual
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        assignedToTechnicianId: session.user.id,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket no encontrado o no asignado a ti" },
        { status: 404 }
      );
    }

    // Actualizar el estado del ticket a IN_PROGRESS
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "IN_PROGRESS",
      },
    });

    // Crear evento
    await prisma.ticketEvent.create({
      data: {
        ticketId: ticketId,
        userId: session.user.id,
        event: "STARTED",
        data: {
          message: "Ticket iniciado por el técnico",
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error starting ticket:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

