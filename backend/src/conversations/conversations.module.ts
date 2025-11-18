import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationsService } from "./conversations.service";
import { ConversationsController } from "./conversations.controller";
import { Conversation } from "./entities/conversation.entity";
import { ConversationTag } from "./entities/conversation-tag.entity";
import { ConversationNote } from "./entities/conversation-note.entity";
import { ContactsModule } from "../contacts/contacts.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationTag, ConversationNote]),
    ContactsModule,
    UsersModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
