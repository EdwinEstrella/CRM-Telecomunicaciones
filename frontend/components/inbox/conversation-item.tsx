"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  channel: string;
  status: string;
  lastMessageAt: string;
  contact: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const channelColors: Record<string, string> = {
    INSTAGRAM: "bg-pink-100 text-pink-800",
    WHATSAPP: "bg-green-100 text-green-800",
    MESSENGER: "bg-blue-100 text-blue-800",
    EMAIL: "bg-purple-100 text-purple-800",
    CHAT: "bg-blue-100 text-blue-800",
    SMS: "bg-yellow-100 text-yellow-800",
    instagram: "bg-pink-100 text-pink-800",
    whatsapp: "bg-green-100 text-green-800",
    messenger: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {conversation.contact.avatar ? (
            <img
              src={conversation.contact.avatar}
              alt={conversation.contact.name}
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="text-lg font-semibold">
              {conversation.contact.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate">{conversation.contact.name}</h3>
            <span className="text-xs text-gray-500">
              {conversation.lastMessageAt
                ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                    addSuffix: true,
                    locale: es,
                  })
                : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded",
                channelColors[conversation.channel as keyof typeof channelColors] ||
                  "bg-gray-100 text-gray-800"
              )}
            >
              {conversation.channel}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded",
                (conversation.status === "active" || conversation.status === "open") && "bg-green-100 text-green-800",
                conversation.status === "pending" && "bg-yellow-100 text-yellow-800",
                conversation.status === "assigned" && "bg-blue-100 text-blue-800",
                (conversation.status === "resolved" || conversation.status === "closed") && "bg-gray-100 text-gray-800"
              )}
            >
              {conversation.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

