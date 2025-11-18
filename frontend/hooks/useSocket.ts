"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

export function useSocket(namespace = "/conversations") {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    /**
     * WebSocket URL Configuration
     * 
     * Uses relative paths by default:
     * - If NEXT_PUBLIC_WS_URL is set, use it
     * - Otherwise, use same origin (works in both dev and prod)
     * - In development, Next.js proxy handles /api, but WebSockets need direct connection
     * - In production, same origin works automatically
     */
    const getWsUrl = () => {
      if (process.env.NEXT_PUBLIC_WS_URL) {
        return process.env.NEXT_PUBLIC_WS_URL;
      }
      
      // In browser, use current origin (works with proxy in dev, same origin in prod)
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      
      // Server-side: fallback (shouldn't happen in client component)
      return '';
    };

    const wsUrl = getWsUrl();
    const socketUrl = wsUrl ? `${wsUrl}${namespace}` : namespace;
    
    const newSocket = io(socketUrl, {
      auth: {
        token: session.accessToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [session, namespace]);

  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socketRef.current?.off(event, callback);
  };

  return {
    socket,
    isConnected,
    emit,
    on,
    off,
  };
}

