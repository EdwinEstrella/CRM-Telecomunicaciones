import { IsString, IsEnum, IsOptional, IsArray, ValidateNested } from "class-validator";
import { MessageType, MessageDirection } from "../entities/message.entity";

class AttachmentDto {
  url: string;
  type: string;
  name?: string;
  size?: number;
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsEnum(MessageDirection)
  direction: MessageDirection;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  attachments?: AttachmentDto[];
}
