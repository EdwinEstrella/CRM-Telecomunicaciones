import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator";

class MaterialDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class CreateTicketReportDto {
  @IsString()
  description: string;

  @IsNumber()
  timeSpent: number; // in minutes

  @IsOptional()
  @IsArray()
  @ValidateNested()
  materials?: MaterialDto[];

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  signature?: string; // Base64
}
