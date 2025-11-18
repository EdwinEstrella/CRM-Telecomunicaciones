import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "../../users/entities/user.entity";

export enum TicketEventType {
  CREATED = "created",
  ASSIGNED = "assigned",
  STATUS_CHANGED = "status_changed",
  PRIORITY_CHANGED = "priority_changed",
  COMMENT_ADDED = "comment_added",
  ATTACHMENT_ADDED = "attachment_added",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

@Entity("ticket_events")
export class TicketEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.events)
  @JoinColumn({ name: "ticketId" })
  ticket: Ticket;

  @Column()
  ticketId: string;

  @Column({
    type: "enum",
    enum: TicketEventType,
  })
  eventType: TicketEventType;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
