"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import { MessageBubble } from "./message-bubble";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
  id: string;
  content: string;
  type: string;
  direction: string;
  createdAt: string;
  attachments?: Array<{
    url: string;
    type: string;
    name?: string;
  }>;
}

export function MessageThread({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, on, off } = useSocket();

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      joinConversation();
    }

    return () => {
      if (conversationId) {
        leaveConversation();
      }
    };
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    };

    on("message:new", handleNewMessage);
    on("message:sent", handleNewMessage);

    return () => {
      off("message:new", handleNewMessage);
      off("message:sent", handleNewMessage);
    };
  }, [socket, conversationId, on, off]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      const data = Array.isArray(response.data) ? response.data : [];
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const joinConversation = () => {
    if (socket) {
      socket.emit("join:conversation", conversationId);
    }
  };

  const leaveConversation = () => {
    if (socket) {
      socket.emit("leave:conversation", conversationId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const showDate =
          index === 0 ||
          new Date(message.createdAt).toDateString() !==
            new Date(messages[index - 1].createdAt).toDateString();

        return (
          <div key={message.id}>
            {showDate && (
              <div className="text-center text-sm text-gray-500 my-4">
                {format(new Date(message.createdAt), "PPP", { locale: es })}
              </div>
            )}
            <MessageBubble message={message} />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

