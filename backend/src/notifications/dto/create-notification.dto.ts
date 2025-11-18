import { IsEnum, IsString, IsUUID, IsOptional, IsObject } from "class-validator";
import { NotificationType } from "../entities/notification.entity";

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
