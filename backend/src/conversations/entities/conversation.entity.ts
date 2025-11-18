import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { Contact } from "../../contacts/entities/contact.entity";
import { User } from "../../users/entities/user.entity";
import { Message } from "../../messages/entities/message.entity";
import { ConversationTag } from "./conversation-tag.entity";
import { ConversationNote } from "./conversation-note.entity";

export enum ConversationChannel {
  INSTAGRAM = "instagram",
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
}

export enum ConversationStatus {
  OPEN = "open",
  ASSIGNED = "assigned",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Contact, { eager: true })
  @JoinColumn({ name: "contactId" })
  contact: Contact;

  @Column()
  contactId: string;

  @Column({
    type: "enum",
    enum: ConversationChannel,
  })
  channel: ConversationChannel;

  @Column({
    type: "enum",
    enum: ConversationStatus,
    default: ConversationStatus.OPEN,
  })
  status: ConversationStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assignedToId" })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ type: "timestamp", nullable: true })
  lastMessageAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ManyToMany(() => ConversationTag, { eager: true })
  @JoinTable({
    name: "conversation_tags",
    joinColumn: { name: "conversationId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags: ConversationTag[];

  @OneToMany(() => ConversationNote, (note) => note.conversation)
  notes: ConversationNote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
