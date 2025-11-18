import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { AutomationService } from "./automation.service";
import { CreateAutomationRuleDto } from "./dto/create-automation-rule.dto";
import { UpdateAutomationRuleDto } from "./dto/update-automation-rule.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";

@Controller("automation")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get("rules")
  @Permissions("automation:read")
  findAll() {
    return this.automationService.findAll();
  }

  @Post("rules")
  @Permissions("automation:create")
  create(@Body() createDto: CreateAutomationRuleDto) {
    return this.automationService.create(createDto);
  }

  @Get("rules/:id")
  @Permissions("automation:read")
  findOne(@Param("id") id: string) {
    return this.automationService.findOne(id);
  }

  @Patch("rules/:id")
  @Permissions("automation:update")
  update(@Param("id") id: string, @Body() updateDto: UpdateAutomationRuleDto) {
    return this.automationService.update(id, updateDto);
  }

  @Delete("rules/:id")
  @Permissions("automation:delete")
  remove(@Param("id") id: string) {
    return this.automationService.remove(id);
  }

  @Patch("rules/:id/toggle")
  @Permissions("automation:update")
  toggle(@Param("id") id: string) {
    return this.automationService.toggle(id);
  }
}
