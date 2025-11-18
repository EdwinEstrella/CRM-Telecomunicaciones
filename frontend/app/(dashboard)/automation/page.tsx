"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  isActive: boolean;
  trigger: string;
  conditions: any[];
  actions: any[];
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await api.get("/automation/rules");
      setRules(response.data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (id: string) => {
    try {
      await api.patch(`/automation/rules/${id}/toggle`);
      fetchRules();
    } catch (error) {
      console.error("Error toggling rule:", error);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Automatización</h1>
          <p className="text-gray-600 mt-1">
            Gestiona reglas de automatización y webhooks
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Regla
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="cursor-pointer"
                >
                  {rule.isActive ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Trigger:</span>
                  <span className="ml-2 font-medium">{rule.trigger}</span>
                </div>
                <div>
                  <span className="text-gray-500">Condiciones:</span>
                  <span className="ml-2">{rule.conditions?.length || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Acciones:</span>
                  <span className="ml-2">{rule.actions?.length || 0}</span>
                </div>
                <div className="pt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      rule.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {rule.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay reglas de automatización configuradas
        </div>
      )}
    </div>
  );
}
