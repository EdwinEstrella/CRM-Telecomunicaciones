import { Controller, Get, Patch, Param, Query, UseGuards, Body } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: any, @Query("page") page?: number, @Query("limit") limit?: number) {
    return this.notificationsService.findAll(user.id, page || 1, limit || 50);
  }

  @Get("unread-count")
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.findUnreadCount(user.id);
  }

  @Patch(":id/read")
  markAsRead(@Param("id") id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch("read-all")
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
