import { IsString, IsEnum, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { AutomationTrigger } from "../entities/automation-rule.entity";

class ConditionDto {
  @IsString()
  field: string;

  @IsString()
  operator: string;

  value: any;
}

class ActionDto {
  @IsString()
  type: string;

  params: Record<string, any>;
}

export class CreateAutomationRuleDto {
  @IsString()
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsEnum(AutomationTrigger)
  trigger: AutomationTrigger;

  @IsArray()
  @ValidateNested()
  conditions: ConditionDto[];

  @IsArray()
  @ValidateNested()
  actions: ActionDto[];
}
