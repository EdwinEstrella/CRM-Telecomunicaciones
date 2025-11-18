import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Role } from "../../roles/entities/role.entity";

export enum UserRole {
  ADMIN = "admin",
  SUPERVISOR = "supervisor",
  AGENT = "agent",
  TECHNICIAN = "technician",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @ManyToMany(() => Role, { eager: false }) // Cambiado a false para evitar errores de carga
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  roles: Role[];

  @Column({ name: "isactive", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "createdat" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedat" })
  updatedAt: Date;

  // Relations will be added as modules are created
  // @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  // tickets: Ticket[];

  // @OneToMany(() => Conversation, (conversation) => conversation.assignedTo)
  // conversations: Conversation[];
}
