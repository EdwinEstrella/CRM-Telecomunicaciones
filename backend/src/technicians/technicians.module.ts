import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TechniciansService } from "./technicians.service";
import { TechniciansController } from "./technicians.controller";
import { TicketReport } from "./entities/ticket-report.entity";
import { TicketsModule } from "../tickets/tickets.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([TicketReport]), TicketsModule, UsersModule],
  controllers: [TechniciansController],
  providers: [TechniciansService],
  exports: [TechniciansService],
})
export class TechniciansModule {}
