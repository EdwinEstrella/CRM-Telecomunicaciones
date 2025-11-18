import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { User } from "../../users/entities/user.entity";
import { TicketEvent } from "./ticket-event.entity";
import { TicketAttachment } from "./ticket-attachment.entity";

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TicketStatus {
  OPEN = "open",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({
    type: "enum",
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column()
  category: string;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: "customerId" })
  customer: Contact;

  @Column()
  customerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assignedToTechnicianId" })
  assignedToTechnician: User;

  @Column({ nullable: true })
  assignedToTechnicianId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdByAgentId" })
  createdByAgent: User;

  @Column()
  createdByAgentId: string;

  @Column({ type: "jsonb", nullable: true })
  location: {
    address: string;
    lat: number;
    lng: number;
  };

  @Column({ type: "timestamp", nullable: true })
  slaDeadline: Date;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt: Date;

  @OneToMany(() => TicketEvent, (event) => event.ticket)
  events: TicketEvent[];

  @OneToMany(() => TicketAttachment, (attachment) => attachment.ticket)
  attachments: TicketAttachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
