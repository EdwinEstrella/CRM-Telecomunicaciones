import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Conversation } from "../../conversations/entities/conversation.entity";

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  LOCATION = "location",
}

export enum MessageDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @Column()
  conversationId: string;

  @Column("text")
  content: string;

  @Column({
    type: "enum",
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: "enum",
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column({ type: "jsonb", nullable: true })
  attachments: Array<{
    url: string;
    type: string;
    name?: string;
    size?: number;
  }>;

  @Column({ default: false })
  read: boolean;

  @Column({ type: "timestamp", nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
