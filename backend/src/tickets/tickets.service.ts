import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { Ticket, TicketStatus, TicketPriority } from "./entities/ticket.entity";
import { TicketEvent, TicketEventType } from "./entities/ticket-event.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { SlaService } from "./sla.service";
import { ContactsService } from "../contacts/contacts.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketEvent)
    private ticketEventsRepository: Repository<TicketEvent>,
    private slaService: SlaService,
    private contactsService: ContactsService,
    private usersService: UsersService
  ) {}

  async create(createTicketDto: CreateTicketDto, createdByAgentId: string): Promise<Ticket> {
    const customer = await this.contactsService.findOne(createTicketDto.customerId);
    const agent = await this.usersService.findOne(createdByAgentId);

    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      customerId: customer.id,
      createdByAgentId: agent.id,
      slaDeadline: this.slaService.calculateDeadline(createTicketDto.priority),
    });

    const savedTicket = await this.ticketsRepository.save(ticket);

    // Create event
    await this.createEvent(
      savedTicket.id,
      TicketEventType.CREATED,
      createdByAgentId,
      "Ticket created"
    );

    return savedTicket;
  }

  async findAll(filters: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToTechnicianId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Ticket[]; total: number }> {
    const where: FindOptionsWhere<Ticket> = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assignedToTechnicianId)
      where.assignedToTechnicianId = filters.assignedToTechnicianId;
    if (filters.customerId) where.customerId = filters.customerId;

    const [data, total] = await this.ticketsRepository.findAndCount({
      where,
      relations: ["customer", "assignedToTechnician", "createdByAgent"],
      order: { createdAt: "DESC" },
      take: filters.limit || 50,
      skip: ((filters.page || 1) - 1) * (filters.limit || 50),
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ["customer", "assignedToTechnician", "createdByAgent", "events", "attachments"],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const oldStatus = ticket.status;
    const oldPriority = ticket.priority;

    Object.assign(ticket, updateTicketDto);

    if (updateTicketDto.status && updateTicketDto.status !== oldStatus) {
      await this.createEvent(
        id,
        TicketEventType.STATUS_CHANGED,
        userId,
        `Status changed from ${oldStatus} to ${updateTicketDto.status}`
      );
    }

    if (updateTicketDto.priority && updateTicketDto.priority !== oldPriority) {
      await this.createEvent(
        id,
        TicketEventType.PRIORITY_CHANGED,
        userId,
        `Priority changed from ${oldPriority} to ${updateTicketDto.priority}`
      );
    }

    return this.ticketsRepository.save(ticket);
  }

  async assign(id: string, assignedToTechnicianId: string, userId: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const technician = await this.usersService.findOne(assignedToTechnicianId);

    ticket.assignedToTechnicianId = technician.id;
    ticket.status = TicketStatus.ASSIGNED;

    await this.createEvent(
      id,
      TicketEventType.ASSIGNED,
      userId,
      `Ticket assigned to ${technician.name}`
    );

    return this.ticketsRepository.save(ticket);
  }

  async createEvent(
    ticketId: string,
    eventType: TicketEventType,
    userId: string,
    description: string,
    metadata?: Record<string, any>
  ): Promise<TicketEvent> {
    const event = this.ticketEventsRepository.create({
      ticketId,
      eventType,
      userId,
      description,
      metadata,
    });
    return this.ticketEventsRepository.save(event);
  }

  async getTimeline(ticketId: string): Promise<TicketEvent[]> {
    return this.ticketEventsRepository.find({
      where: { ticketId },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });
  }
}
