"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { Send, Paperclip } from "lucide-react";

export function MessageInput({
  conversationId,
  onMessageSent,
}: {
  conversationId: string;
  onMessageSent?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { emit } = useSocket();

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content: message,
        type: "text",
        direction: "outbound",
      });

      if (response.data.success || response.data) {
        emit("typing:stop", { conversationId });
        setMessage("");
        onMessageSent?.();
        // Recargar la página para mostrar el nuevo mensaje
        window.location.reload();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload file and attach to message
      console.log("File selected:", file);
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          disabled={sending}
        />
        <Button onClick={handleSend} disabled={sending || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

