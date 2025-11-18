/**
 * ⚠️ LEGACY FILE WARNING
 *
 * This file appears to be a legacy Express server implementation.
 * The main NestJS application should be started using `main.ts` instead.
 *
 * If this file is still needed, consider:
 * 1. Documenting its specific purpose
 * 2. Migrating functionality to NestJS modules
 * 3. Removing if no longer used
 *
 * To start the NestJS application: npm run start:dev
 */

import express = require("express");
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// ⚠️ SECURITY WARNING: Never use default JWT secret in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is required in environment variables");
  process.exit(1);
}

// Type definitions
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

// Prisma client
// ⚠️ SECURITY WARNING: Never hardcode database credentials
// Always use environment variables
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is required in environment variables");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Auth middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
    next();
  });
};

// Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Get user permissions
    const permissions = user.userRoles.flatMap((userRole: any) =>
      userRole.role.rolePermissions.map((rp: any) => rp.permission.name)
    );

    // Return user info and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        permissions: permissions,
      },
      access_token: token,
      token, // Keep for backward compatibility
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Get permissions
    const permissions = user.userRoles.flatMap((userRole: any) =>
      userRole.role.rolePermissions.map((rp: any) => rp.permission.name)
    );

    res.json({
      user: {
        ...user,
        permissions,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard metrics
app.get("/api/reports/dashboard", authenticateToken, async (req, res) => {
  try {
    const [
      totalUsers,
      totalContacts,
      totalTickets,
      openTickets,
      resolvedTickets,
      totalConversations,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.contact.count(),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "OPEN" } }),
      prisma.ticket.count({ where: { status: "RESOLVED" } }),
      prisma.conversation.count(),
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: totalUsers,
      },
      contacts: {
        total: totalContacts,
      },
      tickets: {
        total: totalTickets,
        open: openTickets,
        resolved: resolvedTickets,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0,
      },
      conversations: {
        total: totalConversations,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Users management
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ users });
  } catch (error) {
    console.error("Users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users", authenticateToken, async (req, res) => {
  try {
    const { email, name, password, role = "AGENT" } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running",
    timestamp: new Date().toISOString(),
    database: "Connected",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Check if admin users exist
    const adminUsers = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminUsers === 0) {
      console.log("🔧 Creating admin users...");

      // Create admin role and permissions
      const adminRole = await prisma.role.upsert({
        where: { name: "admin" },
        update: {},
        create: {
          name: "admin",
          description: "Administrator with full access",
        },
      });

      // Create permissions
      const permissions = [
        { name: "users:read", action: "READ", resource: "USERS" },
        { name: "users:create", action: "CREATE", resource: "USERS" },
        { name: "users:update", action: "UPDATE", resource: "USERS" },
        { name: "users:delete", action: "DELETE", resource: "USERS" },
        { name: "reports:view", action: "VIEW", resource: "REPORTS" },
        { name: "settings:edit", action: "EDIT", resource: "SETTINGS" },
      ];

      for (const perm of permissions) {
        await prisma.permission.upsert({
          where: { name: perm.name },
          update: {},
          create: perm,
        });
      }

      // Assign permissions to admin role
      const allPermissions = await prisma.permission.findMany();
      for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: adminRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        });
      }

      // Create admin users
      const adminPassword = await bcrypt.hash("admin123", 10);

      const adminUser = await prisma.user.create({
        data: {
          email: "admin@empresa.com",
          name: "Administrador Principal",
          password: adminPassword,
          role: "ADMIN",
          isActive: true,
        },
      });

      const soporteUser = await prisma.user.create({
        data: {
          email: "soporte@empresa.com",
          name: "Soporte Técnico",
          password: adminPassword,
          role: "ADMIN",
          isActive: true,
        },
      });

      // Assign admin role to users
      for (const user of [adminUser, soporteUser]) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: adminRole.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            roleId: adminRole.id,
          },
        });
      }

      console.log("✅ Admin users created successfully");
      console.log("   📧 admin@empresa.com (Contraseña: admin123)");
      console.log("   📧 soporte@empresa.com (Contraseña: admin123)");
    } else {
      console.log(`✅ Found ${adminUsers} admin users in database`);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Express server with Prisma running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/reports/dashboard`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
