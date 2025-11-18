import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { Conversation, ConversationStatus } from "./entities/conversation.entity";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ContactsService } from "../contacts/contacts.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    private contactsService: ContactsService,
    private usersService: UsersService
  ) {}

  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    let contact = await this.contactsService.findByPhone(createConversationDto.contactPhone);

    if (!contact) {
      contact = await this.contactsService.create({
        name: createConversationDto.contactName || "Unknown",
        phone: createConversationDto.contactPhone,
        metadata: createConversationDto.contactMetadata,
      });
    }

    const conversation = this.conversationsRepository.create({
      contactId: contact.id,
      channel: createConversationDto.channel,
      status: ConversationStatus.OPEN,
    });

    return this.conversationsRepository.save(conversation);
  }

  async findAll(filters: {
    status?: ConversationStatus;
    channel?: string;
    assignedToId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Conversation[]; total: number }> {
    const where: FindOptionsWhere<Conversation> = {};

    if (filters.status) where.status = filters.status;
    if (filters.channel) where.channel = filters.channel as any;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;

    const [data, total] = await this.conversationsRepository.findAndCount({
      where,
      relations: ["contact", "assignedTo", "tags"],
      order: { lastMessageAt: "DESC" },
      take: filters.limit || 50,
      skip: ((filters.page || 1) - 1) * (filters.limit || 50),
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ["contact", "assignedTo", "tags", "notes"],
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findOne(id);
    Object.assign(conversation, updateConversationDto);
    return this.conversationsRepository.save(conversation);
  }

  async assign(id: string, assignedToId: string): Promise<Conversation> {
    const conversation = await this.findOne(id);
    const user = await this.usersService.findOne(assignedToId);
    conversation.assignedToId = user.id;
    conversation.status = ConversationStatus.ASSIGNED;
    return this.conversationsRepository.save(conversation);
  }

  async updateStatus(id: string, status: ConversationStatus): Promise<Conversation> {
    const conversation = await this.findOne(id);
    conversation.status = status;
    return this.conversationsRepository.save(conversation);
  }

  async updateLastMessage(id: string): Promise<void> {
    await this.conversationsRepository.update(id, {
      lastMessageAt: new Date(),
    });
  }

  async addTag(conversationId: string, tagId: string): Promise<Conversation> {
    const conversation = await this.findOne(conversationId);
    // Tag logic will be implemented
    return conversation;
  }

  async removeTag(conversationId: string, tagId: string): Promise<Conversation> {
    const conversation = await this.findOne(conversationId);
    // Tag logic will be implemented
    return conversation;
  }
}
