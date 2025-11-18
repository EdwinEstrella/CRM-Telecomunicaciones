import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Ticket, TicketStatus } from "../tickets/entities/ticket.entity";
import { Conversation } from "../conversations/entities/conversation.entity";
import { Message } from "../messages/entities/message.entity";
import { User, UserRole } from "../users/entities/user.entity";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getDashboardMetrics(startDate?: Date, endDate?: Date) {
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [totalTickets, openTickets, resolvedTickets, totalConversations, totalMessages] =
      await Promise.all([
        this.ticketsRepository.count({ where: dateFilter }),
        this.ticketsRepository.count({ where: { ...dateFilter, status: TicketStatus.OPEN } }),
        this.ticketsRepository.count({ where: { ...dateFilter, status: TicketStatus.RESOLVED } }),
        this.conversationsRepository.count({ where: dateFilter }),
        this.messagesRepository.count({ where: dateFilter }),
      ]);

    // Calculate average resolution time
    const resolvedTicketsWithDates = await this.ticketsRepository.find({
      where: { ...dateFilter, status: "resolved" as any },
      select: ["createdAt", "resolvedAt"],
    });

    const avgResolutionTime =
      resolvedTicketsWithDates.length > 0
        ? resolvedTicketsWithDates.reduce((sum, ticket) => {
            if (ticket.resolvedAt) {
              const diff = ticket.resolvedAt.getTime() - ticket.createdAt.getTime();
              return sum + diff;
            }
            return sum;
          }, 0) /
          resolvedTicketsWithDates.length /
          (1000 * 60 * 60) // Convert to hours
        : 0;

    return {
      tickets: {
        total: totalTickets,
        open: openTickets,
        resolved: resolvedTickets,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      },
      conversations: {
        total: totalConversations,
      },
      messages: {
        total: totalMessages,
      },
    };
  }

  async getTicketsReport(filters: {
    status?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = this.getDateFilter(filters.startDate, filters.endDate);
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;

    const tickets = await this.ticketsRepository.find({
      where,
      relations: ["customer", "assignedToTechnician", "createdByAgent"],
      order: { createdAt: "DESC" },
    });

    return {
      data: tickets,
      summary: {
        total: tickets.length,
        byStatus: this.groupBy(tickets, "status"),
        byPriority: this.groupBy(tickets, "priority"),
      },
    };
  }

  async getConversationsReport(filters: {
    channel?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = this.getDateFilter(filters.startDate, filters.endDate);
    if (filters.channel) where.channel = filters.channel;
    if (filters.status) where.status = filters.status;

    const conversations = await this.conversationsRepository.find({
      where,
      relations: ["contact"],
      order: { createdAt: "DESC" },
    });

    return {
      data: conversations,
      summary: {
        total: conversations.length,
        byChannel: this.groupBy(conversations, "channel"),
        byStatus: this.groupBy(conversations, "status"),
      },
    };
  }

  async getAgentsPerformance(startDate?: Date, endDate?: Date) {
    const agents = await this.usersRepository.find({
      where: { role: UserRole.AGENT },
    });

    const performance = await Promise.all(
      agents.map(async (agent) => {
        const tickets = await this.ticketsRepository.find({
          where: {
            createdByAgentId: agent.id,
            ...this.getDateFilter(startDate, endDate),
          },
        });

        const resolved = tickets.filter((t) => t.status === "resolved").length;

        return {
          agent: {
            id: agent.id,
            name: agent.name,
            email: agent.email,
          },
          tickets: {
            total: tickets.length,
            resolved,
            resolutionRate: tickets.length > 0 ? (resolved / tickets.length) * 100 : 0,
          },
        };
      })
    );

    return performance;
  }

  async getTechniciansPerformance(startDate?: Date, endDate?: Date) {
    const technicians = await this.usersRepository.find({
      where: { role: UserRole.TECHNICIAN },
    });

    const performance = await Promise.all(
      technicians.map(async (technician) => {
        const tickets = await this.ticketsRepository.find({
          where: {
            assignedToTechnicianId: technician.id,
            ...this.getDateFilter(startDate, endDate),
          },
        });

        const resolved = tickets.filter((t) => t.status === "resolved").length;

        return {
          technician: {
            id: technician.id,
            name: technician.name,
            email: technician.email,
          },
          tickets: {
            total: tickets.length,
            resolved,
            resolutionRate: tickets.length > 0 ? (resolved / tickets.length) * 100 : 0,
          },
        };
      })
    );

    return performance;
  }

  private getDateFilter(startDate?: Date, endDate?: Date) {
    if (startDate && endDate) {
      return {
        createdAt: Between(startDate, endDate),
      };
    }
    return {};
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const value = item[key];
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {});
  }
}
