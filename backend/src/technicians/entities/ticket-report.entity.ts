import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { User } from "../../users/entities/user.entity";

@Entity("ticket_reports")
export class TicketReport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: "ticketId" })
  ticket: Ticket;

  @Column()
  ticketId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "technicianId" })
  technician: User;

  @Column()
  technicianId: string;

  @Column("text")
  description: string;

  @Column({ type: "integer" }) // Time in minutes
  timeSpent: number;

  @Column({ type: "jsonb", nullable: true })
  materials: Array<{
    name: string;
    quantity: number;
    unit?: string;
  }>;

  @Column("text", { nullable: true })
  observations: string;

  @Column("text", { nullable: true }) // Base64 signature
  signature: string;

  @Column({ type: "jsonb", nullable: true })
  evidence: Array<{
    url: string;
    type: "before" | "during" | "after";
    description?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;
}
