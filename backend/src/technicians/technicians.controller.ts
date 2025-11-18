import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { TechniciansService } from "./technicians.service";
import { CreateTicketReportDto } from "./dto/create-ticket-report.dto";
import { UploadEvidenceDto } from "./dto/upload-evidence.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";
import { TicketStatus, TicketPriority } from "../tickets/entities/ticket.entity";

@Controller("technicians")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.SUPERVISOR)
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Get("my-tickets")
  getMyTickets(
    @CurrentUser() user: any,
    @Query("status") status?: TicketStatus,
    @Query("priority") priority?: TicketPriority
  ) {
    return this.techniciansService.getMyTickets(user.id, { status, priority });
  }

  @Patch("tickets/:id/start")
  startTicket(@Param("id") id: string, @CurrentUser() user: any) {
    return this.techniciansService.startTicket(id, user.id);
  }

  @Patch("tickets/:id/pause")
  pauseTicket(@Param("id") id: string, @CurrentUser() user: any) {
    return this.techniciansService.pauseTicket(id, user.id);
  }

  @Patch("tickets/:id/complete")
  completeTicket(
    @Param("id") id: string,
    @Body() reportDto: CreateTicketReportDto,
    @CurrentUser() user: any
  ) {
    return this.techniciansService.completeTicket(id, user.id, reportDto);
  }

  @Post("tickets/:id/evidence")
  uploadEvidence(
    @Param("id") id: string,
    @Body() evidenceDto: UploadEvidenceDto,
    @CurrentUser() user: any
  ) {
    return this.techniciansService.uploadEvidence(id, user.id, evidenceDto);
  }

  @Get("tickets/:id/report")
  getTicketReport(@Param("id") id: string, @CurrentUser() user: any) {
    return this.techniciansService.getTicketReport(id, user.id);
  }
}
