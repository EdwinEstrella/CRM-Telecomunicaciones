import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";

export async function seedSimpleUsers(dataSource: DataSource): Promise<void> {
  try {
    // Crear tablas básicas si no existen
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'agent',
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        roleId UUID REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (userId, roleId)
      );
    `);

    // Insertar rol admin si no existe
    await dataSource.query(`
      INSERT INTO roles (name, description)
      VALUES ('admin', 'Administrator with full access')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Generar hashes de contraseñas seguros
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const soportePasswordHash = await bcrypt.hash("admin123", 10);

    // Insertar usuarios administradores si no existen
    await dataSource.query(
      `
      INSERT INTO users (email, password, name, role)
      VALUES ('admin@empresa.com', $1, 'Administrador Principal', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `,
      [adminPasswordHash]
    );

    await dataSource.query(
      `
      INSERT INTO users (email, password, name, role)
      VALUES ('soporte@empresa.com', $1, 'Soporte Técnico', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `,
      [soportePasswordHash]
    );

    // Asignar rol admin a los usuarios
    await dataSource.query(`
      INSERT INTO user_roles (userId, roleId)
      SELECT u.id, r.id
      FROM users u, roles r
      WHERE u.email IN ('admin@empresa.com', 'soporte@empresa.com')
      AND r.name = 'admin'
      ON CONFLICT (userId, roleId) DO NOTHING;
    `);

    console.log("✅ Usuarios administradores creados exitosamente con contraseñas cifradas:");
    console.log("   📧 admin@empresa.com (Contraseña: admin123) - Administrador Principal");
    console.log("   📧 soporte@empresa.com (Contraseña: admin123) - Soporte Técnico");
  } catch (error) {
    console.error("Error en seed simple:", error);
    throw error;
  }
}
