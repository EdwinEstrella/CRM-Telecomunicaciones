import { Injectable } from "@nestjs/common";
import { AutomationRule } from "./entities/automation-rule.entity";
import { AutomationService } from "./automation.service";
import { ActionExecutorService } from "./action-executor.service";

@Injectable()
export class RuleEngineService {
  constructor(
    private automationService: AutomationService,
    private actionExecutor: ActionExecutorService
  ) {}

  async evaluateTrigger(trigger: string, data: any): Promise<void> {
    const rules = await this.automationService.findActiveRulesByTrigger(trigger);

    for (const rule of rules) {
      if (this.evaluateConditions(rule.conditions, data)) {
        await this.executeActions(rule.actions, data);
      }
    }
  }

  private evaluateConditions(
    conditions: Array<{ field: string; operator: string; value: any }>,
    data: any
  ): boolean {
    return conditions.every((condition) => {
      const fieldValue = this.getNestedValue(data, condition.field);
      return this.compareValues(fieldValue, condition.operator, condition.value);
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, prop) => current?.[prop], obj);
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case "equals":
        return actual === expected;
      case "not_equals":
        return actual !== expected;
      case "contains":
        return String(actual).includes(String(expected));
      case "greater_than":
        return Number(actual) > Number(expected);
      case "less_than":
        return Number(actual) < Number(expected);
      case "in":
        return Array.isArray(expected) && expected.includes(actual);
      default:
        return false;
    }
  }

  private async executeActions(
    actions: Array<{ type: string; params: Record<string, any> }>,
    data: any
  ): Promise<void> {
    for (const action of actions) {
      await this.actionExecutor.execute(action.type, action.params, data);
    }
  }
}
