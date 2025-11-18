"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

export function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "outbound";

  return (
    <div
      className={cn(
        "flex mb-4",
        isOutbound ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          isOutbound
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((attachment, idx) => (
              <div key={idx}>
                {attachment.type.startsWith("image/") ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name || "Image"}
                    className="max-w-full rounded"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    {attachment.name || "Download"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isOutbound ? "text-blue-100" : "text-gray-500"
          )}
        >
          {format(new Date(message.createdAt), "HH:mm")}
        </p>
      </div>
    </div>
  );
}

