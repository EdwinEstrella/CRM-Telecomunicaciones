import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { CreateConversationDto } from "./create-conversation.dto";
import { ConversationStatus } from "../entities/conversation.entity";

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;
}
