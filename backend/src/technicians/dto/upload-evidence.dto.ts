import { IsString, IsEnum, IsOptional } from "class-validator";

export class UploadEvidenceDto {
  @IsString()
  url: string;

  @IsEnum(["before", "during", "after"])
  type: "before" | "during" | "after";

  @IsOptional()
  @IsString()
  description?: string;
}
