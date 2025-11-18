import { DataSource } from "typeorm";
import {
  Permission,
  PermissionAction,
  PermissionResource,
} from "../../permissions/entities/permission.entity";

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);

  const permissions = [
    // Inbox permissions
    {
      action: PermissionAction.READ,
      resource: PermissionResource.INBOX,
      name: "inbox:read",
      description: "Read inbox conversations",
    },
    {
      action: PermissionAction.WRITE,
      resource: PermissionResource.INBOX,
      name: "inbox:write",
      description: "Write messages in inbox",
    },
    {
      action: PermissionAction.ASSIGN,
      resource: PermissionResource.INBOX,
      name: "inbox:assign",
      description: "Assign conversations",
    },
    // Tickets permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.TICKETS,
      name: "tickets:create",
      description: "Create tickets",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.TICKETS,
      name: "tickets:read",
      description: "Read tickets",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.TICKETS,
      name: "tickets:update",
      description: "Update tickets",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.TICKETS,
      name: "tickets:delete",
      description: "Delete tickets",
    },
    {
      action: PermissionAction.ASSIGN,
      resource: PermissionResource.TICKETS,
      name: "tickets:assign",
      description: "Assign tickets",
    },
    // Users permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.USERS,
      name: "users:create",
      description: "Create users",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.USERS,
      name: "users:read",
      description: "Read users",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.USERS,
      name: "users:update",
      description: "Update users",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.USERS,
      name: "users:delete",
      description: "Delete users",
    },
    // Reports permissions
    {
      action: PermissionAction.VIEW,
      resource: PermissionResource.REPORTS,
      name: "reports:view",
      description: "View reports",
    },
    {
      action: PermissionAction.EXPORT,
      resource: PermissionResource.REPORTS,
      name: "reports:export",
      description: "Export reports",
    },
    // Settings permissions
    {
      action: PermissionAction.VIEW,
      resource: PermissionResource.SETTINGS,
      name: "settings:view",
      description: "View settings",
    },
    {
      action: PermissionAction.EDIT,
      resource: PermissionResource.SETTINGS,
      name: "settings:edit",
      description: "Edit settings",
    },
    // Automation permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.AUTOMATION,
      name: "automation:create",
      description: "Create automation rules",
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.AUTOMATION,
      name: "automation:read",
      description: "Read automation rules",
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.AUTOMATION,
      name: "automation:update",
      description: "Update automation rules",
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.AUTOMATION,
      name: "automation:delete",
      description: "Delete automation rules",
    },
  ];

  for (const perm of permissions) {
    const existing = await permissionRepository.findOne({
      where: { name: perm.name },
    });
    if (!existing) {
      await permissionRepository.save(permissionRepository.create(perm));
    }
  }
}
