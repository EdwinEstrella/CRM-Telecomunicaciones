"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TechniciansPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Módulo de Técnicos</h1>
        <p className="text-gray-600 mt-1">Gestión de trabajo de campo y tickets técnicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Dashboard de Técnico</h2>
              <p className="text-sm text-gray-600">Visualiza y gestiona tus tickets asignados</p>
            </div>
          </div>
          <Link href="/technicians/dashboard">
            <Button className="w-full">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Funcionalidades</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Ver tickets asignados
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Iniciar trabajo en campo
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Capturar evidencias
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Reportar materiales utilizados
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Firma digital del cliente
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Completar tickets
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

