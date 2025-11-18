import { DataSource } from "typeorm";
import { config } from "dotenv";
import { DatabaseConfigService } from "../database.config";
import { ConfigService } from "@nestjs/config";
import { seedSimpleUsers } from "./simple-users.seed";

config();

async function runSeeds() {
  const configService = new ConfigService();
  const dbConfig = new DatabaseConfigService(configService);
  const options = dbConfig.createTypeOrmOptions();

  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log("Database connected");

    console.log("Creating admin users...");
    await seedSimpleUsers(dataSource);
    console.log("Admin users created successfully");

    console.log("All seeds completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
