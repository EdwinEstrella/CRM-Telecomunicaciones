"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Sparkles } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function SettingsPage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const response = await api.post("/seed");
      if (response.data.success) {
        setSeedResult(
          `✅ Datos creados: ${response.data.data.contacts} contactos, ${response.data.data.conversations} conversaciones, ${response.data.data.messages} mensajes`
        );
      } else {
        setSeedResult("❌ Error al crear datos de prueba");
      }
    } catch (error) {
      setSeedResult("❌ Error al crear datos de prueba");
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Gestiona la configuración del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Perfil de Usuario</h2>
              <p className="text-sm text-gray-600">Gestiona tu información personal</p>
            </div>
          </div>
          <Link href="/settings/profile" className="w-full">
            <Button variant="outline" className="w-full">
              Editar Perfil
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notificaciones</h2>
              <p className="text-sm text-gray-600">Configura tus preferencias de notificaciones</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Configurar Notificaciones
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Roles y Permisos</h2>
              <p className="text-sm text-gray-600">Gestiona roles y permisos del sistema</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Gestionar Roles
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Base de Datos</h2>
              <p className="text-sm text-gray-600">Configuración y respaldos</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Ver Configuración
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Datos de Prueba</h2>
              <p className="text-sm text-gray-600">Generar contactos, conversaciones y mensajes de prueba</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seeding ? "Generando..." : "Generar Datos de Prueba"}
          </Button>
          {seedResult && (
            <p className="mt-2 text-sm text-gray-600">{seedResult}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

