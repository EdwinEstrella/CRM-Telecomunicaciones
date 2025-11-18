import { Injectable } from "@nestjs/common";
import { TicketPriority } from "./entities/ticket.entity";

@Injectable()
export class SlaService {
  private readonly slaHours = {
    [TicketPriority.LOW]: 72, // 3 days
    [TicketPriority.MEDIUM]: 24, // 1 day
    [TicketPriority.HIGH]: 8, // 8 hours
    [TicketPriority.URGENT]: 2, // 2 hours
  };

  calculateDeadline(priority: TicketPriority): Date {
    const hours = this.slaHours[priority] || 24;
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + hours);
    return deadline;
  }

  isOverdue(ticket: { slaDeadline: Date; status: string }): boolean {
    if (!ticket.slaDeadline) return false;
    if (ticket.status === "resolved" || ticket.status === "closed") return false;
    return new Date() > ticket.slaDeadline;
  }

  getTimeRemaining(ticket: { slaDeadline: Date }): number {
    if (!ticket.slaDeadline) return 0;
    const now = new Date();
    const diff = ticket.slaDeadline.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60))); // hours
  }
}
