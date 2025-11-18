import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConversationsGateway } from "./conversations.gateway";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "secret",
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ConversationsGateway],
  exports: [ConversationsGateway],
})
export class WebSocketModule {}
