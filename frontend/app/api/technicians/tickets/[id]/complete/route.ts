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
    const body = await request.json();
    const { description, timeSpent, materials, observations, signature } = body;

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

    // Actualizar el ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    });

    // Crear evento con los datos del reporte
    await prisma.ticketEvent.create({
      data: {
        ticketId: ticketId,
        userId: session.user.id,
        event: "COMPLETED",
        data: {
          description,
          timeSpent,
          materials,
          observations,
          signature,
          completedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket,
      message: "Ticket completado exitosamente",
    });
  } catch (error) {
    console.error("Error completing ticket:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

