"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConversationItem } from "./conversation-item";

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
  assignedTo?: {
    id: string;
    name: string;
  };
}

export function ConversationList({
  onSelectConversation,
  selectedId,
}: {
  onSelectConversation: (id: string) => void;
  selectedId?: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchConversations = async () => {
    try {
      const response = await api.get("/conversations", {
        params: { limit: 50 },
      });
      const data = response.data.data || response.data || [];
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.contact.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-80 border-r p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <Input
          placeholder="Buscar conversaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {search ? "No se encontraron conversaciones" : "No hay conversaciones"}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

