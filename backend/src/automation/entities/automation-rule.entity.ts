import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum AutomationTrigger {
  MESSAGE_RECEIVED = "message_received",
  CONVERSATION_CREATED = "conversation_created",
  TICKET_CREATED = "ticket_created",
  TICKET_UPDATED = "ticket_updated",
  TICKET_UNASSIGNED = "ticket_unassigned",
}

@Entity("automation_rules")
export class AutomationRule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: "enum",
    enum: AutomationTrigger,
  })
  trigger: AutomationTrigger;

  @Column({ type: "jsonb" })
  conditions: {
    field: string;
    operator: string;
    value: any;
  }[];

  @Column({ type: "jsonb" })
  actions: {
    type: string;
    params: Record<string, any>;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
