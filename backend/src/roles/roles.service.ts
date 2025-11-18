import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { PermissionsService } from "../permissions/permissions.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const permissions = await Promise.all(
      createRoleDto.permissionIds.map((id) => this.permissionsService.findOne(id))
    );
    const role = this.rolesRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      permissions,
    });
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ["permissions"] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    if (updateRoleDto.permissionIds) {
      const permissions = await Promise.all(
        updateRoleDto.permissionIds.map((pid) => this.permissionsService.findOne(pid))
      );
      role.permissions = permissions;
    }
    if (updateRoleDto.name) role.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;
    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);
  }
}
