"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  customer: {
    name: string;
    phone?: string;
  };
  assignedToTechnician?: {
    name: string;
  };
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  slaDeadline?: string;
  createdAt: string;
  events: Array<{
    id: string;
    eventType: string;
    description: string;
    createdAt: string;
    user?: {
      name: string;
    };
  }>;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${params.id}`);
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/tickets/${params.id}/status`, { status });
      fetchTicket();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-gray-600 mt-1">
            Creado el {format(new Date(ticket.createdAt), "PPP", { locale: es })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button onClick={() => updateStatus("resolved")}>
            Marcar como Resuelto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.events?.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{event.description}</p>
                      <p className="text-sm text-gray-500">
                        {event.user?.name} -{" "}
                        {format(new Date(event.createdAt), "PPP p", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium capitalize">{ticket.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prioridad</p>
                <p className="font-medium capitalize">{ticket.priority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium">{ticket.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{ticket.customer.name}</p>
                {ticket.customer.phone && (
                  <p className="text-sm text-gray-500">{ticket.customer.phone}</p>
                )}
              </div>
              {ticket.assignedToTechnician && (
                <div>
                  <p className="text-sm text-gray-500">Técnico Asignado</p>
                  <p className="font-medium">{ticket.assignedToTechnician.name}</p>
                </div>
              )}
              {ticket.location && (
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{ticket.location.address}</p>
                </div>
              )}
              {ticket.slaDeadline && (
                <div>
                  <p className="text-sm text-gray-500">SLA Deadline</p>
                  <p className="font-medium">
                    {format(new Date(ticket.slaDeadline), "PPP p", { locale: es })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

