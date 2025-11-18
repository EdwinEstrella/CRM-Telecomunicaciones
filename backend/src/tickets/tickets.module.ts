import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { Ticket } from "./entities/ticket.entity";
import { TicketEvent } from "./entities/ticket-event.entity";
import { TicketAttachment } from "./entities/ticket-attachment.entity";
import { SlaService } from "./sla.service";
import { ContactsModule } from "../contacts/contacts.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketEvent, TicketAttachment]),
    ContactsModule,
    UsersModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, SlaService],
  exports: [TicketsService],
})
export class TicketsModule {}
