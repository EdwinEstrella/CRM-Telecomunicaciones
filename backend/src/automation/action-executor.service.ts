import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ActionExecutorService {
  constructor(private configService: ConfigService) {}

  async execute(type: string, params: Record<string, any>, data: any): Promise<void> {
    switch (type) {
      case "send_webhook":
        await this.sendWebhook(params.url, data);
        break;
      case "send_n8n_webhook":
        await this.sendN8NWebhook(params.workflowId, data);
        break;
      case "assign_conversation":
        // Implementation would call ConversationsService
        break;
      case "create_ticket":
        // Implementation would call TicketsService
        break;
      case "send_notification":
        // Implementation would call NotificationsService
        break;
      default:
        console.warn(`Unknown action type: ${type}`);
    }
  }

  private async sendWebhook(url: string, data: any): Promise<void> {
    try {
      await axios.post(url, data, {
        timeout: 5000,
      });
    } catch (error) {
      console.error("Error sending webhook:", error);
      // Could implement retry logic here
    }
  }

  private async sendN8NWebhook(workflowId: string, data: any): Promise<void> {
    const n8nUrl = this.configService.get<string>("N8N_URL");
    if (!n8nUrl) {
      console.warn("N8N_URL not configured");
      return;
    }

    try {
      await axios.post(`${n8nUrl}/webhook/${workflowId}`, data, {
        timeout: 5000,
      });
    } catch (error) {
      console.error("Error sending N8N webhook:", error);
    }
  }
}
