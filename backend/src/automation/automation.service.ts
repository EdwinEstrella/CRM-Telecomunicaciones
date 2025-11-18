import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AutomationRule } from "./entities/automation-rule.entity";
import { CreateAutomationRuleDto } from "./dto/create-automation-rule.dto";
import { UpdateAutomationRuleDto } from "./dto/update-automation-rule.dto";

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationRule)
    private automationRulesRepository: Repository<AutomationRule>
  ) {}

  async create(createDto: CreateAutomationRuleDto): Promise<AutomationRule> {
    const rule = this.automationRulesRepository.create(createDto);
    return this.automationRulesRepository.save(rule);
  }

  async findAll(): Promise<AutomationRule[]> {
    return this.automationRulesRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<AutomationRule> {
    const rule = await this.automationRulesRepository.findOne({
      where: { id },
    });
    if (!rule) {
      throw new NotFoundException(`Automation rule with ID ${id} not found`);
    }
    return rule;
  }

  async update(id: string, updateDto: UpdateAutomationRuleDto): Promise<AutomationRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, updateDto);
    return this.automationRulesRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.automationRulesRepository.remove(rule);
  }

  async toggle(id: string): Promise<AutomationRule> {
    const rule = await this.findOne(id);
    rule.isActive = !rule.isActive;
    return this.automationRulesRepository.save(rule);
  }

  async findActiveRulesByTrigger(trigger: string): Promise<AutomationRule[]> {
    return this.automationRulesRepository.find({
      where: { trigger: trigger as any, isActive: true },
    });
  }
}
