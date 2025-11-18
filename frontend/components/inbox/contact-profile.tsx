"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

export function ContactProfile({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  const fetchContact = async () => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      const data = response.data.data || response.data;
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-80 border-l p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="w-80 border-l p-4">
        <p className="text-gray-500">Contacto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span className="text-2xl font-semibold">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <CardTitle>{contact.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.phone && (
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
          )}
          {contact.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{contact.email}</p>
            </div>
          )}
          <Button className="w-full" variant="outline">
            Crear Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

