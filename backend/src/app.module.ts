import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { ContactsModule } from "./contacts/contacts.module";
import { ConversationsModule } from "./conversations/conversations.module";
import { MessagesModule } from "./messages/messages.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { TicketsModule } from "./tickets/tickets.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { TechniciansModule } from "./technicians/technicians.module";
import { AutomationModule } from "./automation/automation.module";
import { ReportsModule } from "./reports/reports.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ContactsModule,
    ConversationsModule,
    MessagesModule,
    TicketsModule,
    NotificationsModule,
    TechniciansModule,
    AutomationModule,
    ReportsModule,
    WebSocketModule,
    AuthModule,
  ],
})
export class AppModule {}
