"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, Wrench } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  priority: string;
  status: string;
  customer: {
    name: string;
  };
  location?: {
    address: string;
  };
  slaDeadline?: string;
}

export default function TechniciansDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/technicians/my-tickets");
      const data = response.data.data || [];
      setTickets(data);

      setStats({
        total: data.length,
        inProgress: data.filter((t: Ticket) => t.status === "IN_PROGRESS").length,
        completed: data.filter((t: Ticket) => t.status === "RESOLVED" || t.status === "CLOSED").length,
        pending: data.filter((t: Ticket) => t.status === "OPEN").length,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTicket = async (ticketId: string) => {
    try {
      await api.patch(`/technicians/tickets/${ticketId}/start`);
      fetchTickets();
    } catch (error) {
      console.error("Error starting ticket:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard de Técnico</h1>
        <p className="text-gray-600">Gestión de tickets asignados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Wrench className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">Tickets asignados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-gray-500">Trabajando ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-500">Por iniciar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500">Hoy</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Mis Tickets</h2>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          ticket.priority === "URGENT"
                            ? "bg-red-100 text-red-800"
                            : ticket.priority === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          ticket.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "CLOSED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Cliente: {ticket.customer.name}
                    </p>
                    {ticket.location && typeof ticket.location === 'object' && 'address' in ticket.location && (
                      <p className="text-sm text-gray-500">
                        📍 {(ticket.location as any).address}
                      </p>
                    )}
                    {ticket.slaDeadline && (
                      <p className="text-xs text-gray-400 mt-1">
                        SLA: {new Date(ticket.slaDeadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {ticket.status === "OPEN" && (
                      <Button
                        size="sm"
                        onClick={() => startTicket(ticket.id)}
                      >
                        Iniciar
                      </Button>
                    )}
                    <Link href={`/technicians/tickets/${ticket.id}`}>
                      <Button size="sm" variant="outline">
                        {ticket.status === "IN_PROGRESS" ? "Continuar" : "Ver Detalle"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tienes tickets asignados
          </div>
        )}
      </div>
    </div>
  );
}
