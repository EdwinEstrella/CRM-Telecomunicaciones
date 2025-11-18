import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    return this.permissionsRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionsRepository.findOne({ where: { name } });
  }

  async create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.permissionsRepository.create(permission);
    return this.permissionsRepository.save(newPermission);
  }
}
