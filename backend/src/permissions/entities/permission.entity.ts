import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Role } from "../../roles/entities/role.entity";

export enum PermissionAction {
  READ = "read",
  WRITE = "write",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  ASSIGN = "assign",
  VIEW = "view",
  EXPORT = "export",
  EDIT = "edit",
}

export enum PermissionResource {
  INBOX = "inbox",
  TICKETS = "tickets",
  USERS = "users",
  REPORTS = "reports",
  SETTINGS = "settings",
  AUTOMATION = "automation",
}

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  action: PermissionAction;

  @Column()
  resource: PermissionResource;

  @Column({ unique: true })
  name: string; // e.g., "inbox:read", "tickets:create"

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
