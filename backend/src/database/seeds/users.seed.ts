import { DataSource } from "typeorm";
import { User, UserRole } from "../../users/entities/user.entity";
import { Role } from "../../roles/entities/role.entity";
import * as bcrypt from "bcrypt";

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Get admin role
  const adminRole = await roleRepository.findOne({ where: { name: "admin" } });
  if (!adminRole) {
    throw new Error("Admin role not found. Run roles seed first.");
  }

  const users = [
    {
      email: "admin@empresa.com",
      name: "Administrador Principal",
      password: "admin123",
      role: UserRole.ADMIN,
      description: "Administrador principal - Dueño del sistema",
    },
    {
      email: "soporte@empresa.com",
      name: "Soporte Técnico",
      password: "soporte123",
      role: UserRole.ADMIN,
      description: "Desarrollador/Soporte - Acceso completo",
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
        roles: [adminRole], // Give them all permissions
      });

      await userRepository.save(user);
      console.log(`✅ Usuario creado: ${userData.email} (${userData.description})`);
      console.log(`   Contraseña: ${userData.password}`);
    } else {
      console.log(`ℹ️  Usuario ya existe: ${userData.email}`);
    }
  }
}
