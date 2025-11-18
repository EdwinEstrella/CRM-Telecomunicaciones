import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Validate critical environment variables
  const jwtSecret = configService.get<string>("JWT_SECRET");
  if (!jwtSecret) {
    logger.error("JWT_SECRET is not set in environment variables");
    throw new Error("JWT_SECRET is required");
  }

  // Security
  app.use(helmet());

  // CORS Configuration
  // Supports multiple origins for flexibility in development and production
  const corsOrigin = configService.get<string>("CORS_ORIGIN");
  const nodeEnv = configService.get<string>("NODE_ENV") || "development";

  // Build allowed origins array
  const allowedOrigins: string[] = [];

  if (corsOrigin) {
    // If CORS_ORIGIN is set, split by comma for multiple origins
    allowedOrigins.push(...corsOrigin.split(",").map((origin) => origin.trim()));
  }

  // In development, also allow localhost variants
  if (nodeEnv === "development") {
    const localhostOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ];
    localhostOrigins.forEach((origin) => {
      if (!allowedOrigins.includes(origin)) {
        allowedOrigins.push(origin);
      }
    });
  }

  // If no origins configured, allow all in development (not recommended for production)
  const corsOptions = {
    origin:
      allowedOrigins.length > 0
        ? (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          }
        : nodeEnv === "development"
          ? true // Allow all in development if not configured
          : false, // Deny all in production if not configured
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.enableCors(corsOptions);

  if (nodeEnv === "production" && allowedOrigins.length === 0) {
    logger.warn(
      "⚠️  CORS_ORIGIN not set in production. CORS is disabled. Set CORS_ORIGIN to allow specific origins."
    );
  }

  // Rate Limiting
  const rateLimitMax = configService.get<number>("RATE_LIMIT_MAX") || 100;
  const rateLimitTtl = configService.get<number>("RATE_LIMIT_TTL") || 60;
  app.use(
    rateLimit({
      windowMs: rateLimitTtl * 1000,
      max: rateLimitMax,
      message: "Too many requests from this IP, please try again later.",
    })
  );

  // Global prefix
  app.setGlobalPrefix("api");

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const port = configService.get<number>("PORT") || 3001;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
