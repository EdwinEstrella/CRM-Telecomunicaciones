import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Post as PostFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { TicketStatus, TicketPriority } from "./entities/ticket.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("tickets")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @Permissions("tickets:read")
  findAll(
    @Query("status") status?: TicketStatus,
    @Query("priority") priority?: TicketPriority,
    @Query("assignedToTechnicianId") assignedToTechnicianId?: string,
    @Query("customerId") customerId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.ticketsService.findAll({
      status,
      priority,
      assignedToTechnicianId,
      customerId,
      page,
      limit,
    });
  }

  @Post()
  @Permissions("tickets:create")
  create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketsService.create(createTicketDto, user.id);
  }

  @Get(":id")
  @Permissions("tickets:read")
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id")
  @Permissions("tickets:update")
  update(
    @Param("id") id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: any
  ) {
    return this.ticketsService.update(id, updateTicketDto, user.id);
  }

  @Patch(":id/assign")
  @Permissions("tickets:assign")
  assign(
    @Param("id") id: string,
    @Body("assignedToTechnicianId") assignedToTechnicianId: string,
    @CurrentUser() user: any
  ) {
    return this.ticketsService.assign(id, assignedToTechnicianId, user.id);
  }

  @Patch(":id/status")
  @Permissions("tickets:update")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: TicketStatus,
    @CurrentUser() user: any
  ) {
    return this.ticketsService.update(id, { status }, user.id);
  }

  @Patch(":id/priority")
  @Permissions("tickets:update")
  updatePriority(
    @Param("id") id: string,
    @Body("priority") priority: TicketPriority,
    @CurrentUser() user: any
  ) {
    return this.ticketsService.update(id, { priority }, user.id);
  }

  @Get(":id/timeline")
  @Permissions("tickets:read")
  getTimeline(@Param("id") id: string) {
    return this.ticketsService.getTimeline(id);
  }
}
