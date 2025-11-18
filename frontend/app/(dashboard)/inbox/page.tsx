"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ConversationList } from "@/components/inbox/conversation-list";
import { api } from "@/lib/api";

// Lazy load componentes pesados que solo se usan cuando hay una conversación seleccionada
const MessageThread = dynamic(() => import("@/components/inbox/message-thread").then(mod => ({ default: mod.MessageThread })), {
  loading: () => <div className="flex-1 flex items-center justify-center"><div className="animate-pulse text-gray-400">Cargando conversación...</div></div>,
  ssr: false,
});

const MessageInput = dynamic(() => import("@/components/inbox/message-input").then(mod => ({ default: mod.MessageInput })), {
  loading: () => <div className="h-20 border-t bg-white" />,
  ssr: false,
});

const ContactProfile = dynamic(() => import("@/components/inbox/contact-profile").then(mod => ({ default: mod.ContactProfile })), {
  loading: () => <div className="w-80 border-l bg-white" />,
  ssr: false,
});

export default function InboxPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedConversationId) {
      fetchConversationDetails();
    }
  }, [selectedConversationId]);

  const fetchConversationDetails = async () => {
    try {
      const response = await api.get(`/conversations/${selectedConversationId}`);
      const data = response.data.data || response.data;
      setContactId(data?.contact?.id || null);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-white px-6 py-3">
        <h1 className="text-lg font-semibold">Inbox</h1>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ConversationList
          onSelectConversation={setSelectedConversationId}
          selectedId={selectedConversationId || undefined}
        />
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <>
              <MessageThread conversationId={selectedConversationId} />
              <MessageInput
                conversationId={selectedConversationId}
                onMessageSent={() => {
                  // Refresh conversation list
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecciona una conversación para comenzar
            </div>
          )}
        </div>
        {contactId && <ContactProfile contactId={contactId} />}
      </div>
    </div>
  );
}
