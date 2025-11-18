"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Palette, Moon, Sun, Save, ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePermissions } from "@/hooks/usePermissions";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export default function ThemePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [canCustomize, setCanCustomize] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#10b981",
    background: "#ffffff",
    foreground: "#0f172a",
  });

  useEffect(() => {
    // Verificar permisos para personalización
    const canCustomizeColors = hasPermission("settings:edit") || session?.user?.role === "admin";
    setCanCustomize(canCustomizeColors);

    // Cargar configuración guardada del usuario
    loadUserTheme();
  }, [session]);

  const loadUserTheme = async () => {
    try {
      const response = await api.get("/users/theme");
      if (response.data.success && response.data.data) {
        setColorScheme(response.data.data.colorScheme || colorScheme);
      }
    } catch (error) {
      // Si no hay configuración guardada, usar valores por defecto
      console.log("No hay configuración de tema guardada");
    }
  };

  const handleSave = async () => {
    if (!canCustomize) {
      toast.error("Sin permisos", {
        description: "No tienes permisos para personalizar colores",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/users/theme", {
        theme,
        colorScheme,
      });

      if (response.data.success) {
        // Aplicar colores personalizados
        applyColorScheme(colorScheme);
        toast.success("Configuración guardada", {
          description: "Tu tema personalizado ha sido guardado",
        });
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Error al guardar la configuración",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty("--primary", hexToHsl(scheme.primary));
    root.style.setProperty("--secondary", hexToHsl(scheme.secondary));
    root.style.setProperty("--accent", hexToHsl(scheme.accent));
    if (theme === "light") {
      root.style.setProperty("--background", hexToHsl(scheme.background));
      root.style.setProperty("--foreground", hexToHsl(scheme.foreground));
    }
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    if (!canCustomize) return;
    const newScheme = { ...colorScheme, [key]: value };
    setColorScheme(newScheme);
    applyColorScheme(newScheme);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Configuración de Tema</h1>
        <p className="text-gray-600 dark:text-neutral-400 mt-1">
          Personaliza la apariencia de la aplicación
        </p>
      </div>

      <div className="space-y-6">
        {/* Modo de Tema */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <CardTitle>Modo de Tema</CardTitle>
                <CardDescription>Elige entre modo claro u oscuro</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
                )}
                <Label htmlFor="theme-toggle" className="cursor-pointer">
                  {theme === "dark" ? "Modo Oscuro" : "Modo Claro"}
                </Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {theme === "dark"
                ? "El modo oscuro reduce la fatiga visual en ambientes con poca luz"
                : "El modo claro es ideal para trabajar durante el día"}
            </p>
          </CardContent>
        </Card>

        {/* Personalización de Colores */}
        {canCustomize ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Personalización de Colores</CardTitle>
                  <CardDescription>
                    Personaliza los colores de la aplicación según tus preferencias
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Color Primario</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primary-color"
                      value={colorScheme.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-16 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorScheme.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Color Secundario</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="secondary-color"
                      value={colorScheme.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-16 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorScheme.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="#64748b"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Color de Acento</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="accent-color"
                      value={colorScheme.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="w-16 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorScheme.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                {theme === "light" && (
                  <div className="space-y-2">
                    <Label htmlFor="background-color">Color de Fondo</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="background-color"
                        value={colorScheme.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorScheme.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setColorScheme({
                      primary: "#3b82f6",
                      secondary: "#64748b",
                      accent: "#10b981",
                      background: "#ffffff",
                      foreground: "#0f172a",
                    });
                    applyColorScheme({
                      primary: "#3b82f6",
                      secondary: "#64748b",
                      accent: "#10b981",
                      background: "#ffffff",
                      foreground: "#0f172a",
                    });
                  }}
                >
                  Restaurar Valores por Defecto
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <CardTitle>Personalización de Colores</CardTitle>
                  <CardDescription>
                    Esta función requiere permisos de administrador
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Solo los usuarios con permisos de administrador pueden personalizar los colores
                de la aplicación. Contacta a tu administrador si necesitas esta funcionalidad.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

