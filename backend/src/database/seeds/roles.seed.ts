import { DataSource } from "typeorm";
import { Role } from "../../roles/entities/role.entity";
import { Permission } from "../../permissions/entities/permission.entity";

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  // Get all permissions
  const allPermissions = await permissionRepository.find();
  const permissionMap = new Map(allPermissions.map((p) => [p.name, p]));

  const roles = [
    {
      name: "admin",
      description: "Administrator with full access",
      permissions: allPermissions.map((p) => p.id),
    },
    {
      name: "supervisor",
      description: "Supervisor with management access",
      permissions: [
        "inbox:read",
        "inbox:write",
        "inbox:assign",
        "tickets:read",
        "tickets:update",
        "tickets:assign",
        "users:read",
        "reports:view",
        "reports:export",
        "settings:view",
        "automation:read",
        "automation:update",
      ]
        .map((name) => permissionMap.get(name)?.id)
        .filter((id) => id !== undefined),
    },
    {
      name: "agent",
      description: "Customer service agent",
      permissions: [
        "inbox:read",
        "inbox:write",
        "tickets:create",
        "tickets:read",
        "tickets:update",
        "reports:view",
      ]
        .map((name) => permissionMap.get(name)?.id)
        .filter((id) => id !== undefined),
    },
    {
      name: "technician",
      description: "Field technician",
      permissions: ["tickets:read", "tickets:update", "reports:view"]
        .map((name) => permissionMap.get(name)?.id)
        .filter((id) => id !== undefined),
    },
  ];

  for (const roleData of roles) {
    const existing = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!existing) {
      const permissions = await permissionRepository.findBy({
        id: roleData.permissions as any,
      });
      const role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        permissions,
      });
      await roleRepository.save(role);
    }
  }
}
