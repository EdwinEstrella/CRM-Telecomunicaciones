"use client";

import { Card } from "@/components/ui/card";
import { MessageSquare, Ticket, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Conversaciones Activas",
      value: "24",
      change: "+12%",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tickets Abiertos",
      value: "18",
      change: "+5%",
      icon: Ticket,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Usuarios Activos",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Tasa de Resolución",
      value: "94%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva conversación iniciada</p>
                  <p className="text-xs text-gray-500">Hace {i * 5} minutos</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tickets Pendientes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">Ticket #{1000 + i}</p>
                  <p className="text-xs text-gray-500">Cliente {i}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

