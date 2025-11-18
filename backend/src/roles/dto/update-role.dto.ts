import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsArray, IsUUID } from "class-validator";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  permissionIds?: string[];
}
