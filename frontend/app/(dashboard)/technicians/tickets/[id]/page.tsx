"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Clock } from "lucide-react";

// Lazy load SignatureCanvas solo cuando se necesita
const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
  ssr: false,
  loading: () => <div className="h-48 border rounded-md flex items-center justify-center text-gray-400">Cargando canvas...</div>,
});

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  customer: {
    name: string;
    phone?: string;
  };
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  slaDeadline?: string;
}

export default function TechnicianTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<Array<{ name: string; quantity: number }>>([]);
  const [observations, setObservations] = useState("");
  const signatureRef = useRef<SignatureCanvas>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${params.id}`);
      setTicket(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!description.trim()) {
      alert("Por favor, describe el trabajo realizado");
      return;
    }

    setSubmitting(true);
    try {
      const signature = signatureRef.current?.toDataURL() || "";

      const response = await api.patch(`/technicians/tickets/${params.id}/complete`, {
        description,
        timeSpent,
        materials,
        observations,
        signature,
      });

      if (response.data.success) {
        router.push("/technicians/dashboard");
      } else {
        alert("Error al completar el ticket");
      }
    } catch (error) {
      console.error("Error completing ticket:", error);
      alert("Error al completar el ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: "", quantity: 1 }]);
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
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
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <p className="text-gray-600 mt-1">Cliente: {ticket.customer.name}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="mt-1">{ticket.description}</p>
              </div>
              {ticket.location && typeof ticket.location === 'object' && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </p>
                  <p className="mt-1">{(ticket.location as any).address || "Sin dirección"}</p>
                  {(ticket.location as any).lat && (ticket.location as any).lng && (
                    <div className="mt-2 h-48 bg-gray-100 rounded">
                      {/* Google Maps would go here */}
                      <p className="text-center text-gray-400 py-20">
                        Mapa: {(ticket.location as any).lat}, {(ticket.location as any).lng}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {ticket.customer.phone && (
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="mt-1">{ticket.customer.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidencias</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Capturar Evidencia
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Cierre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Descripción del Trabajo</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el trabajo realizado..."
                />
              </div>

              <div>
                <Label htmlFor="timeSpent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempo Invertido (minutos)
                </Label>
                <Input
                  id="timeSpent"
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Materiales Utilizados</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                  >
                    Agregar
                  </Button>
                </div>
                {materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Material"
                      value={material.name}
                      onChange={(e) =>
                        updateMaterial(index, "name", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={material.quantity}
                      onChange={(e) =>
                        updateMaterial(index, "quantity", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="observations">Observaciones</Label>
                <textarea
                  id="observations"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md mt-1"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div>
                <Label>Firma Digital</Label>
                <div className="border rounded-md mt-1">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "signature-canvas w-full",
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => signatureRef.current?.clear()}
                >
                  Limpiar
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={submitting || !description.trim()}
              >
                {submitting ? "Completando..." : "Completar Ticket"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

