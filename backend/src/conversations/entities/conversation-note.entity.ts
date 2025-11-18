import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "../../users/entities/user.entity";

@Entity("conversation_notes")
export class ConversationNote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @Column()
  conversationId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column()
  createdById: string;

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
