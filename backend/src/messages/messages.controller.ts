import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";

@Controller("conversations/:conversationId/messages")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @Permissions("inbox:read")
  findAll(
    @Param("conversationId") conversationId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.messagesService.findAll(conversationId, page || 1, limit || 50);
  }

  @Post()
  @Permissions("inbox:write")
  create(
    @Param("conversationId") conversationId: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    return this.messagesService.create(conversationId, createMessageDto);
  }

  @Patch(":id/read")
  @Permissions("inbox:read")
  markAsRead(@Param("id") id: string) {
    return this.messagesService.markAsRead(id);
  }
}
