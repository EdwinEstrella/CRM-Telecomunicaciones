import { IsString, IsOptional, IsObject } from "class-validator";

export class CreateContactDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
