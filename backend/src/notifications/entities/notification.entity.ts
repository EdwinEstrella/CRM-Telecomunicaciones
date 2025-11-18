import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum NotificationType {
  CONVERSATION_ASSIGNED = "conversation_assigned",
  TICKET_CREATED = "ticket_created",
  TICKET_UPDATED = "ticket_updated",
  TICKET_ASSIGNED = "ticket_assigned",
  MESSAGE_RECEIVED = "message_received",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column("text")
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  link: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
