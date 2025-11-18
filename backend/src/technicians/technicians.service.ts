import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TicketReport } from "./entities/ticket-report.entity";
import { TicketsService } from "../tickets/tickets.service";
import { TicketStatus, TicketPriority } from "../tickets/entities/ticket.entity";
import { CreateTicketReportDto } from "./dto/create-ticket-report.dto";
import { UploadEvidenceDto } from "./dto/upload-evidence.dto";

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(TicketReport)
    private ticketReportsRepository: Repository<TicketReport>,
    private ticketsService: TicketsService
  ) {}

  async getMyTickets(
    technicianId: string,
    filters?: {
      status?: TicketStatus;
      priority?: TicketPriority;
    }
  ) {
    return this.ticketsService.findAll({
      assignedToTechnicianId: technicianId,
      ...filters,
    });
  }

  async startTicket(ticketId: string, technicianId: string) {
    const ticket = await this.ticketsService.findOne(ticketId);

    if (ticket.assignedToTechnicianId !== technicianId) {
      throw new ForbiddenException("Ticket not assigned to you");
    }

    return this.ticketsService.update(ticketId, { status: TicketStatus.IN_PROGRESS }, technicianId);
  }

  async pauseTicket(ticketId: string, technicianId: string) {
    const ticket = await this.ticketsService.findOne(ticketId);

    if (ticket.assignedToTechnicianId !== technicianId) {
      throw new ForbiddenException("Ticket not assigned to you");
    }

    return this.ticketsService.update(ticketId, { status: TicketStatus.ASSIGNED }, technicianId);
  }

  async completeTicket(ticketId: string, technicianId: string, reportDto: CreateTicketReportDto) {
    const ticket = await this.ticketsService.findOne(ticketId);

    if (ticket.assignedToTechnicianId !== technicianId) {
      throw new ForbiddenException("Ticket not assigned to you");
    }

    // Create report
    const report = this.ticketReportsRepository.create({
      ...reportDto,
      ticketId: ticket.id,
      technicianId,
    });
    await this.ticketReportsRepository.save(report);

    // Update ticket status
    await this.ticketsService.update(ticketId, { status: TicketStatus.RESOLVED }, technicianId);

    return report;
  }

  async uploadEvidence(ticketId: string, technicianId: string, evidenceDto: UploadEvidenceDto) {
    const ticket = await this.ticketsService.findOne(ticketId);

    if (ticket.assignedToTechnicianId !== technicianId) {
      throw new ForbiddenException("Ticket not assigned to you");
    }

    // Get or create report
    let report = await this.ticketReportsRepository.findOne({
      where: { ticketId, technicianId },
    });

    if (!report) {
      report = this.ticketReportsRepository.create({
        ticketId,
        technicianId,
        description: "",
        timeSpent: 0,
        evidence: [],
      });
    }

    if (!report.evidence) {
      report.evidence = [];
    }

    report.evidence.push(evidenceDto);
    return this.ticketReportsRepository.save(report);
  }

  async getTicketReport(ticketId: string, technicianId: string) {
    const report = await this.ticketReportsRepository.findOne({
      where: { ticketId, technicianId },
      relations: ["ticket", "technician"],
    });

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    return report;
  }
}
