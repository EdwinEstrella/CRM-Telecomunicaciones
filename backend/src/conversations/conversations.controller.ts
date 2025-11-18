import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ConversationStatus } from "./entities/conversation.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("conversations")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @Permissions("inbox:read")
  findAll(
    @Query("status") status?: ConversationStatus,
    @Query("channel") channel?: string,
    @Query("assignedToId") assignedToId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.conversationsService.findAll({
      status,
      channel,
      assignedToId,
      page,
      limit,
    });
  }

  @Get(":id")
  @Permissions("inbox:read")
  findOne(@Param("id") id: string) {
    return this.conversationsService.findOne(id);
  }

  @Patch(":id")
  @Permissions("inbox:write")
  update(@Param("id") id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Patch(":id/assign")
  @Permissions("inbox:assign")
  assign(@Param("id") id: string, @Body("assignedToId") assignedToId: string) {
    return this.conversationsService.assign(id, assignedToId);
  }

  @Patch(":id/status")
  @Permissions("inbox:write")
  updateStatus(@Param("id") id: string, @Body("status") status: ConversationStatus) {
    return this.conversationsService.updateStatus(id, status);
  }

  @Post(":id/tags")
  @Permissions("inbox:write")
  addTag(@Param("id") id: string, @Body("tagId") tagId: string) {
    return this.conversationsService.addTag(id, tagId);
  }

  @Delete(":id/tags/:tagId")
  @Permissions("inbox:write")
  removeTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.conversationsService.removeTag(id, tagId);
  }
}
