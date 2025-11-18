import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get<string>("DATABASE_HOST", "localhost"),
      port: this.configService.get<number>("DATABASE_PORT", 5432),
      username: this.configService.get<string>("DATABASE_USER", "postgres"),
      password: this.configService.get<string>("DATABASE_PASSWORD", "postgres"),
      database: this.configService.get<string>("DATABASE_NAME", "crm_db"),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: false, // Deshabilitado temporalmente - usar migraciones
      logging: this.configService.get<string>("NODE_ENV") === "development",
      ssl:
        this.configService.get<string>("NODE_ENV") === "production"
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}
