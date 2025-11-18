import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🌱 Iniciando seed de datos de prueba...");

    // Crear contactos de prueba
    const contacts = await Promise.all([
      prisma.contact.upsert({
        where: { email: "cliente1@example.com" },
        update: {},
        create: {
          email: "cliente1@example.com",
          name: "Juan Pérez",
          phone: "+1234567890",
        },
      }),
      prisma.contact.upsert({
        where: { email: "cliente2@example.com" },
        update: {},
        create: {
          email: "cliente2@example.com",
          name: "María García",
          phone: "+1234567891",
        },
      }),
      prisma.contact.upsert({
        where: { email: "cliente3@example.com" },
        update: {},
        create: {
          email: "cliente3@example.com",
          name: "Carlos Rodríguez",
          phone: "+1234567892",
        },
      }),
      prisma.contact.upsert({
        where: { email: "cliente4@example.com" },
        update: {},
        create: {
          email: "cliente4@example.com",
          name: "Ana Martínez",
          phone: "+1234567893",
        },
      }),
      prisma.contact.upsert({
        where: { email: "cliente5@example.com" },
        update: {},
        create: {
          email: "cliente5@example.com",
          name: "Luis Sánchez",
          phone: "+1234567894",
        },
      }),
    ]);

    console.log(`✅ ${contacts.length} contactos creados/actualizados`);

    // Crear conversaciones de prueba
    const conversations = [];
    const channels = ["EMAIL", "CHAT", "WHATSAPP", "SMS"] as const;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const channel = channels[i % channels.length];

      const conversation = await prisma.conversation.upsert({
        where: {
          id: `conv-${contact.id}`,
        },
        update: {},
        create: {
          id: `conv-${contact.id}`,
          contactId: contact.id,
          channel: channel,
          status: i % 2 === 0 ? "active" : "pending",
        },
      });
      conversations.push(conversation);
    }

    console.log(`✅ ${conversations.length} conversaciones creadas/actualizadas`);

    // Crear mensajes de prueba para cada conversación
    const allMessages = [];
    for (const conversation of conversations) {
      const contact = contacts.find((c) => c.id === conversation.contactId);
      if (!contact) continue;

      const conversationMessages = [
        {
          content: `Hola, tengo una consulta sobre ${contact.name.split(" ")[0]}`,
          direction: "inbound",
        },
        {
          content: "Hola, gracias por contactarnos. ¿En qué puedo ayudarte?",
          direction: "outbound",
        },
        {
          content: "Necesito información sobre los servicios disponibles",
          direction: "inbound",
        },
        {
          content: "Por supuesto, te puedo ayudar con eso. ¿Qué tipo de servicio te interesa?",
          direction: "outbound",
        },
        {
          content: "Me interesa el plan premium",
          direction: "inbound",
        },
        {
          content: "Excelente elección. El plan premium incluye todas las características avanzadas.",
          direction: "outbound",
        },
      ];

      for (const msgData of conversationMessages) {
        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            content: msgData.content,
            direction: msgData.direction,
          },
        });
        allMessages.push(message);
      }

      // Actualizar lastMessageAt de la conversación
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    console.log(`✅ ${allMessages.length} mensajes creados`);

    // Crear una conversación adicional de prueba con más mensajes
    const testContact = await prisma.contact.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        email: "test@example.com",
        name: "Cliente de Prueba",
        phone: "+1234567890",
      },
    });

    const testConversation = await prisma.conversation.upsert({
      where: {
        id: `conv-test-${testContact.id}`,
      },
      update: {},
      create: {
        id: `conv-test-${testContact.id}`,
        contactId: testContact.id,
        channel: "CHAT",
        status: "active",
      },
    });

    const testMessages = await Promise.all([
      prisma.message.create({
        data: {
          conversationId: testConversation.id,
          content: "Hola, necesito ayuda con mi pedido",
          direction: "inbound",
        },
      }),
      prisma.message.create({
        data: {
          conversationId: testConversation.id,
          content: "Hola, claro. ¿Cuál es el número de tu pedido?",
          direction: "outbound",
        },
      }),
      prisma.message.create({
        data: {
          conversationId: testConversation.id,
          content: "El número es #12345",
          direction: "inbound",
        },
      }),
      prisma.message.create({
        data: {
          conversationId: testConversation.id,
          content: "Perfecto, déjame revisar el estado de tu pedido...",
          direction: "outbound",
        },
      }),
      prisma.message.create({
        data: {
          conversationId: testConversation.id,
          content: "Tu pedido está en camino, llegará mañana",
          direction: "outbound",
        },
      }),
    ]);

    // Actualizar lastMessageAt de la conversación de prueba
    await prisma.conversation.update({
      where: { id: testConversation.id },
      data: { lastMessageAt: new Date() },
    });

    console.log(`✅ Conversación de prueba creada con ${testMessages.length} mensajes`);

    return NextResponse.json({
      success: true,
      message: "Datos de prueba creados exitosamente",
      data: {
        contacts: contacts.length + 1,
        conversations: conversations.length + 1,
        messages: allMessages.length + testMessages.length,
      },
    });
  } catch (error) {
    console.error("❌ Error en seed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

