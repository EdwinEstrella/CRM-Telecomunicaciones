"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Lazy load Recharts - es una librería pesada
const RechartsWrapper = dynamic(() => import("@/components/reports/recharts-wrapper").then(mod => ({ default: mod.RechartsWrapper })), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Cargando gráficos...</div>,
  ssr: false,
});

interface DashboardMetrics {
  tickets: {
    total: number;
    open: number;
    resolved: number;
    avgResolutionTime: number;
  };
  conversations: {
    total: number;
  };
  messages: {
    total: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get("/reports/dashboard", { params });
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const ticketsData = metrics
    ? [
        { name: "Abiertos", value: metrics.tickets.open },
        { name: "Resueltos", value: metrics.tickets.resolved },
      ]
    : [];

  const kpiData = metrics
    ? [
        { name: "Tickets Totales", value: metrics.tickets.total },
        { name: "Conversaciones", value: metrics.conversations.total },
        { name: "Mensajes", value: metrics.messages.total },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reportes y Analytics</h1>
          <p className="text-gray-600 mt-1">Métricas y estadísticas del sistema</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
            className="w-40"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha fin"
            className="w-40"
          />
          <Button onClick={fetchMetrics}>Filtrar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.tickets.total || 0}</div>
            <p className="text-sm text-gray-500 mt-1">
              {metrics?.tickets.open || 0} abiertos, {metrics?.tickets.resolved || 0} resueltos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics?.tickets.avgResolutionTime || 0}h
            </div>
            <p className="text-sm text-gray-500 mt-1">Tiempo promedio de resolución</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.conversations.total || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Total de conversaciones</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <RechartsWrapper ticketsData={ticketsData} kpiData={[]} colors={COLORS} showPie={true} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPIs Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <RechartsWrapper ticketsData={[]} kpiData={kpiData} colors={COLORS} showBar={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
