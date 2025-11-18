import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification, NotificationType } from "./entities/notification.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 50
  ): Promise<{ data: Notification[]; total: number }> {
    const [data, total] = await this.notificationsRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update({ userId, read: false }, { read: true });
  }

  // Helper methods for creating specific notifications
  async notifyConversationAssigned(userId: string, conversationId: string, metadata?: any) {
    return this.create({
      userId,
      type: NotificationType.CONVERSATION_ASSIGNED,
      title: "Nueva conversación asignada",
      message: "Se te ha asignado una nueva conversación",
      link: `/inbox?conversation=${conversationId}`,
      metadata,
    });
  }

  async notifyTicketCreated(userId: string, ticketId: string, metadata?: any) {
    return this.create({
      userId,
      type: NotificationType.TICKET_CREATED,
      title: "Nuevo ticket creado",
      message: "Se ha creado un nuevo ticket",
      link: `/tickets/${ticketId}`,
      metadata,
    });
  }

  async notifyTicketAssigned(userId: string, ticketId: string, metadata?: any) {
    return this.create({
      userId,
      type: NotificationType.TICKET_ASSIGNED,
      title: "Ticket asignado",
      message: "Se te ha asignado un nuevo ticket",
      link: `/tickets/${ticketId}`,
      metadata,
    });
  }
}
