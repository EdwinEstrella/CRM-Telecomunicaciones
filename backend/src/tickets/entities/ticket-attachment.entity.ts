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

@Entity("ticket_attachments")
export class TicketAttachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.attachments)
  @JoinColumn({ name: "ticketId" })
  ticket: Ticket;

  @Column()
  ticketId: string;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "uploadedById" })
  uploadedBy: User;

  @Column()
  uploadedById: string;

  @CreateDateColumn()
  createdAt: Date;
}
