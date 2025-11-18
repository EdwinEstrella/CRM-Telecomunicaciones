import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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

  console.log(`✅ ${contacts.length} contactos creados`);

  // Crear conversaciones de prueba
  const conversations = await Promise.all(
    contacts.map((contact, index) =>
      prisma.conversation.upsert({
        where: {
          id: `conv-${contact.id}`,
        },
        update: {},
        create: {
          id: `conv-${contact.id}`,
          contactId: contact.id,
          channel: ["EMAIL", "CHAT", "WHATSAPP", "SMS"][index % 4] as any,
          status: index % 2 === 0 ? "active" : "pending",
        },
      })
    )
  );

  console.log(`✅ ${conversations.length} conversaciones creadas`);

  // Crear mensajes de prueba para cada conversación
  const messages = [];
  for (const conversation of conversations) {
    const contact = contacts.find((c) => c.id === conversation.contactId);
    if (!contact) continue;

    // Mensaje inicial del cliente
    messages.push(
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: `Hola, tengo una consulta sobre ${contact.name.split(" ")[0]}`,
          direction: "inbound",
        },
      })
    );

    // Respuesta del agente
    messages.push(
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: "Hola, gracias por contactarnos. ¿En qué puedo ayudarte?",
          direction: "outbound",
        },
      })
    );

    // Seguimiento del cliente
    messages.push(
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: "Necesito información sobre los servicios disponibles",
          direction: "inbound",
        },
      })
    );
  }

  console.log(`✅ ${messages.length} mensajes creados`);

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

