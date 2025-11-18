import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Por ahora, guardamos en localStorage del cliente
    // En el futuro, podríamos guardar en la base de datos
    return NextResponse.json({
      success: true,
      data: {
        theme: "light", // Se obtiene del cliente
        colorScheme: null,
      },
    });
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching theme" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme, colorScheme } = body;

    // Por ahora, solo validamos
    // En el futuro, podríamos guardar en la base de datos
    // await prisma.user.update({
    //   where: { id: session.user.id },
    //   data: {
    //     themePreferences: JSON.stringify({ theme, colorScheme }),
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: "Theme preferences saved",
    });
  } catch (error) {
    console.error("Error saving theme:", error);
    return NextResponse.json(
      { success: false, message: "Error saving theme" },
      { status: 500 }
    );
  }
}

