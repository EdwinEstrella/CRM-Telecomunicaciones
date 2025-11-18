import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { WsJwtGuard } from "./guards/ws-jwt.guard";

@WebSocketGateway({
  namespace: "/conversations",
  cors: {
    origin: (origin, callback) => {
      // This will be configured dynamically via IoAdapter
      // For now, allow all in development, restrict in production via CORS_ORIGIN
      const nodeEnv = process.env.NODE_ENV || "development";
      if (nodeEnv === "development") {
        callback(null, true);
      } else {
        // In production, check against CORS_ORIGIN
        const corsOrigin = process.env.CORS_ORIGIN;
        if (!corsOrigin) {
          callback(new Error("CORS_ORIGIN not configured"), false);
          return;
        }
        const allowedOrigins = corsOrigin.split(",").map((o) => o.trim());
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"), false);
        }
      }
    },
    credentials: true,
  },
})
export class ConversationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization?.split(" ")[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
      client.data.userId = payload.sub;
      client.data.userRole = payload.role;

      // Join user's personal room
      client.join(`user:${payload.sub}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup if needed
  }

  @SubscribeMessage("join:conversation")
  handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conversation:${conversationId}`);
  }

  @SubscribeMessage("leave:conversation")
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string
  ) {
    client.leave(`conversation:${conversationId}`);
  }

  @SubscribeMessage("typing:start")
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.to(`conversation:${data.conversationId}`).emit("user:typing", {
      userId: client.data.userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage("typing:stop")
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.to(`conversation:${data.conversationId}`).emit("user:stopped-typing", {
      userId: client.data.userId,
      conversationId: data.conversationId,
    });
  }

  // Methods to emit events from services
  emitNewMessage(conversationId: string, message: any) {
    this.server.to(`conversation:${conversationId}`).emit("message:new", message);
  }

  emitMessageSent(conversationId: string, message: any) {
    this.server.to(`conversation:${conversationId}`).emit("message:sent", message);
  }

  emitConversationAssigned(conversationId: string, assignedToId: string) {
    this.server.to(`user:${assignedToId}`).emit("conversation:assigned", {
      conversationId,
      assignedToId,
    });
  }

  emitMessageRead(conversationId: string, messageId: string) {
    this.server.to(`conversation:${conversationId}`).emit("message:read", {
      messageId,
      conversationId,
    });
  }
}
