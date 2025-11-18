"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  customer: {
    name: string;
  };
  assignedToTechnician?: {
    name: string;
  };
  createdAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const response = await api.get("/tickets", { params });
      let data = response.data.data || [];

      if (filters.search) {
        data = data.filter(
          (ticket: Ticket) =>
            ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            ticket.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const statusColors = {
    open: "bg-green-100 text-green-800",
    assigned: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-gray-100 text-gray-800",
    closed: "bg-gray-200 text-gray-900",
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-gray-600 mt-1">Gestión de tickets de avería</p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ticket
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Buscar tickets..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Todos los estados</option>
          <option value="open">Abierto</option>
          <option value="assigned">Asignado</option>
          <option value="in_progress">En progreso</option>
          <option value="resolved">Resuelto</option>
          <option value="closed">Cerrado</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          priorityColors[ticket.priority as keyof typeof priorityColors] ||
                          "bg-gray-100"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          statusColors[ticket.status as keyof typeof statusColors] ||
                          "bg-gray-100"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Cliente: {ticket.customer.name}</span>
                      {ticket.assignedToTechnician && (
                        <span>Técnico: {ticket.assignedToTechnician.name}</span>
                      )}
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron tickets
        </div>
      )}
    </div>
  );
}

