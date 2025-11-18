import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutomationService } from "./automation.service";
import { AutomationController } from "./automation.controller";
import { AutomationRule } from "./entities/automation-rule.entity";
import { RuleEngineService } from "./rule-engine.service";
import { ActionExecutorService } from "./action-executor.service";

@Module({
  imports: [TypeOrmModule.forFeature([AutomationRule])],
  controllers: [AutomationController],
  providers: [AutomationService, RuleEngineService, ActionExecutorService],
  exports: [AutomationService, RuleEngineService],
})
export class AutomationModule {}
