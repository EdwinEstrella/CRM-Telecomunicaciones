import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ConversationsService } from "../conversations/conversations.service";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private conversationsService: ConversationsService
  ) {}

  async create(conversationId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const conversation = await this.conversationsService.findOne(conversationId);
    const message = this.messagesRepository.create({
      ...createMessageDto,
      conversationId: conversation.id,
    });
    const savedMessage = await this.messagesRepository.save(message);

    // Update conversation last message time
    await this.conversationsService.updateLastMessage(conversationId);

    return savedMessage;
  }

  async findAll(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { conversationId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findOne(id);
    message.read = true;
    message.readAt = new Date();
    return this.messagesRepository.save(message);
  }
}
