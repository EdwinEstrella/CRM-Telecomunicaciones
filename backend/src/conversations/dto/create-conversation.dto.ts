import { IsEnum, IsString, IsOptional, IsObject } from "class-validator";
import { ConversationChannel } from "../entities/conversation.entity";

export class CreateConversationDto {
  @IsEnum(ConversationChannel)
  channel: ConversationChannel;

  @IsString()
  contactPhone: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsObject()
  contactMetadata?: Record<string, any>;
}
