import { IsString, IsEnum, IsUUID, IsOptional, IsObject, ValidateNested } from "class-validator";
import { TicketPriority } from "../entities/ticket.entity";

class LocationDto {
  @IsString()
  address: string;

  @IsOptional()
  lat?: number;

  @IsOptional()
  lng?: number;
}

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsString()
  category: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  assignedToTechnicianId?: string;

  @IsOptional()
  @ValidateNested()
  location?: LocationDto;
}
