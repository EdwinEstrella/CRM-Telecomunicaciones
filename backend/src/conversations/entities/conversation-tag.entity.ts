import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from "typeorm";
import { Conversation } from "./conversation.entity";

@Entity("conversation_tags")
export class ConversationTag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string; // Hex color

  @ManyToMany(() => Conversation, (conversation) => conversation.tags)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
