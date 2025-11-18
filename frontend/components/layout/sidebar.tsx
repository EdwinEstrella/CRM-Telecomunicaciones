"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard as Dashboard,
  Ticket,
  Folder,
  Calendar as CalendarIcon,
  Users as UserMultiple,
  BarChart3 as Analytics,
  FileText as DocumentAdd,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  Plus as AddLarge,
  Filter,
  Clock as Time,
  Loader2 as InProgress,
  CheckCircle2 as CheckmarkOutline,
  Flag,
  Archive,
  Eye as View,
  FileText as Report,
  Star as StarFilled,
  Users2 as Group,
  BarChart as ChartBar,
  FolderOpen,
  Share,
  Upload as CloudUpload,
  Shield as Security,
  Bell as Notification,
  Plug as Integration,
  MessageSquare,
  Bot,
  Wrench,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ------------------------------ Avatar -------------------------------- */
function AvatarCircle() {
  const { theme } = useTheme();
  return (
    <div className={`relative rounded-full shrink-0 size-8 ${theme === 'dark' ? 'bg-black' : 'bg-gray-200'}`}>
      <div className={`flex items-center justify-center size-8 ${theme === 'dark' ? 'text-neutral-50' : 'text-gray-700'}`}>
        <UserIcon size={16} />
      </div>
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-full border pointer-events-none ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-300'}`}
      />
    </div>
  );
}

/* ------------------------------ User Menu -------------------------------- */
function UserMenu({ theme }: { theme: 'dark' | 'light' }) {
  const { data: session } = useSession();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className={`w-full pt-2 border-t shrink-0 ${
      theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'
    }`}>
      <div className={`flex items-center gap-2 px-2 py-2 ${
        theme === 'dark' ? 'text-neutral-50' : 'text-gray-900'
      }`}>
        <AvatarCircle />
        <div className="text-[14px] flex-1 truncate">{session?.user?.name || "Usuario"}</div>
        <div className="relative">
          <button
            type="button"
            className={`size-8 rounded-md flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
            }`}
            aria-label="Más"
            onClick={() => setOpen(!open)}
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="4" cy="8" r="1" fill="currentColor" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />
              <Card className={`absolute right-0 bottom-full mb-2 w-48 z-20 ${
                theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-white'
              }`}>
                <CardContent className="p-0">
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-neutral-800 text-neutral-50' 
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Salir</span>
                  </button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Types / Content Map -------------------------- */
interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
}

interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}

interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

function getSidebarContent(activeSection: string, pathname: string): SidebarContent {
  const contentMap: Record<string, SidebarContent> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "Vista General",
          items: [
            {
              icon: <View size={16} className="text-current" />,
              label: "Resumen",
              href: "/dashboard",
              isActive: pathname === "/dashboard",
            },
            {
              icon: <Dashboard size={16} className="text-current" />,
              label: "Panel Ejecutivo",
              hasDropdown: true,
              children: [
                { label: "Resumen de Ingresos", href: "/dashboard/revenue" },
                { label: "Indicadores Clave", href: "/dashboard/kpi" },
                { label: "Progreso de Objetivos", href: "/dashboard/goals" },
                { label: "Destacados por Departamento", href: "/dashboard/highlights" },
              ],
            },
            {
              icon: <ChartBar size={16} className="text-current" />,
              label: "Panel de Operaciones",
              hasDropdown: true,
              children: [
                { label: "Línea de Tiempo", href: "/dashboard/timeline" },
                { label: "Asignación de Recursos", href: "/dashboard/resources" },
                { label: "Rendimiento del Equipo", href: "/dashboard/performance" },
              ],
            },
          ],
        },
      ],
    },
    inbox: {
      title: "Inbox",
      sections: [
        {
          title: "Acciones Rápidas",
          items: [
            { icon: <AddLarge size={16} className="text-current" />, label: "Nueva conversación", href: "/inbox/new" },
            { icon: <Filter size={16} className="text-current" />, label: "Filtrar conversaciones", href: "/inbox" },
          ],
        },
        {
          title: "Conversaciones",
          items: [
            {
              icon: <Time size={16} className="text-current" />,
              label: "Pendientes",
              href: "/inbox?status=pending",
              isActive: pathname === "/inbox" && pathname.includes("pending"),
            },
            {
              icon: <InProgress size={16} className="text-current" />,
              label: "En Progreso",
              href: "/inbox?status=active",
              isActive: pathname === "/inbox" && pathname.includes("active"),
            },
            {
              icon: <CheckmarkOutline size={16} className="text-current" />,
              label: "Resueltas",
              href: "/inbox?status=resolved",
              isActive: pathname === "/inbox" && pathname.includes("resolved"),
            },
          ],
        },
      ],
    },
    tickets: {
      title: "Tickets",
      sections: [
        {
          title: "Acciones Rápidas",
          items: [
            { icon: <AddLarge size={16} className="text-current" />, label: "Nuevo ticket", href: "/tickets/new" },
            { icon: <Filter size={16} className="text-current" />, label: "Filtrar tickets", href: "/tickets" },
          ],
        },
        {
          title: "Mis Tickets",
          items: [
            {
              icon: <Time size={16} className="text-current" />,
              label: "Vencen hoy",
              href: "/tickets?filter=due-today",
            },
            {
              icon: <InProgress size={16} className="text-current" />,
              label: "En progreso",
              href: "/tickets?filter=in-progress",
            },
            {
              icon: <CheckmarkOutline size={16} className="text-current" />,
              label: "Completados",
              href: "/tickets?filter=completed",
            },
          ],
        },
        {
          title: "Otros",
          items: [
            {
              icon: <Flag size={16} className="text-current" />,
              label: "Tickets prioritarios",
              href: "/tickets?filter=priority",
            },
            { icon: <Archive size={16} className="text-current" />, label: "Archivados", href: "/tickets?filter=archived" },
          ],
        },
      ],
    },
    reports: {
      title: "Reportes",
      sections: [
        {
          title: "Reportes",
          items: [
            { icon: <Report size={16} className="text-current" />, label: "Reporte de rendimiento", href: "/reports" },
            { icon: <ChartBar size={16} className="text-current" />, label: "Finalización de tickets", href: "/reports/tickets" },
            { icon: <Analytics size={16} className="text-current" />, label: "Productividad del equipo", href: "/reports/productivity" },
          ],
        },
        {
          title: "Análisis",
          items: [
            {
              icon: <StarFilled size={16} className="text-current" />,
              label: "Métricas clave",
              hasDropdown: true,
              children: [
                { label: "Tickets completados: 24", href: "/reports/metrics/completed" },
                { label: "Tiempo promedio: 2.5d", href: "/reports/metrics/time" },
                { label: "Eficiencia del equipo: 87%", href: "/reports/metrics/efficiency" },
              ],
            },
          ],
        },
      ],
    },
    automation: {
      title: "Automatización",
      sections: [
        {
          title: "Acciones Rápidas",
          items: [
            { icon: <AddLarge size={16} className="text-current" />, label: "Nueva automatización", href: "/automation/new" },
            { icon: <Filter size={16} className="text-current" />, label: "Filtrar reglas", href: "/automation" },
          ],
        },
        {
          title: "Reglas Activas",
          items: [
            {
              icon: <Bot size={16} className="text-current" />,
              label: "Respuestas automáticas",
              href: "/automation/auto-reply",
            },
            {
              icon: <Bot size={16} className="text-current" />,
              label: "Asignación automática",
              href: "/automation/auto-assign",
            },
          ],
        },
      ],
    },
    users: {
      title: "Usuarios",
      sections: [
        {
          title: "Gestión",
          items: [
            { icon: <UserMultiple size={16} className="text-current" />, label: "Todos los usuarios", href: "/users" },
            { icon: <AddLarge size={16} className="text-current" />, label: "Invitar usuario", href: "/users/invite" },
            { icon: <Group size={16} className="text-current" />, label: "Gestionar equipos", href: "/users/teams" },
          ],
        },
      ],
    },
    technicians: {
      title: "Técnicos",
      sections: [
        {
          title: "Gestión",
          items: [
            { icon: <Wrench size={16} className="text-current" />, label: "Dashboard de técnico", href: "/technicians/dashboard" },
            { icon: <UserMultiple size={16} className="text-current" />, label: "Todos los técnicos", href: "/technicians" },
            { icon: <CalendarIcon size={16} className="text-current" />, label: "Calendario", href: "/technicians/calendar" },
          ],
        },
      ],
    },
    settings: {
      title: "Configuración",
      sections: [
        {
          title: "Cuenta",
          items: [
            { icon: <UserIcon size={16} className="text-current" />, label: "Configuración de perfil", href: "/settings/profile" },
            { icon: <Security size={16} className="text-current" />, label: "Seguridad", href: "/settings/security" },
            { icon: <Notification size={16} className="text-current" />, label: "Notificaciones", href: "/settings/notifications" },
          ],
        },
        {
          title: "Sistema",
          items: [
            {
              icon: <SettingsIcon size={16} className="text-current" />,
              label: "Preferencias",
              hasDropdown: true,
              children: [
                { icon: <View size={14} className="text-current" />, label: "Configuración de tema", href: "/settings/theme" },
                { icon: <Time size={14} className="text-current" />, label: "Zona horaria", href: "/settings/timezone" },
                { icon: <Notification size={14} className="text-current" />, label: "Notificaciones por defecto", href: "/settings/default-notifications" },
              ],
            },
            { icon: <Integration size={16} className="text-current" />, label: "Integraciones", href: "/settings/integrations" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.dashboard;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */
function IconNavButton({
  children,
  isActive = false,
  theme,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  theme: 'dark' | 'light';
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-500 ${
        isActive
          ? theme === 'dark' ? "bg-neutral-800 text-neutral-50" : "bg-blue-100 text-blue-600"
          : theme === 'dark' ? "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {children}
    </div>
  );
}

function IconNavigation({
  pathname,
}: {
  pathname: string;
}) {
  const { theme } = useTheme();
  
  const navItems = [
    { id: "dashboard", icon: <Dashboard size={16} />, label: "Dashboard", href: "/dashboard" },
    { id: "inbox", icon: <MessageSquare size={16} />, label: "Inbox", href: "/inbox" },
    { id: "tickets", icon: <Ticket size={16} />, label: "Tickets", href: "/tickets" },
    { id: "reports", icon: <Analytics size={16} />, label: "Reportes", href: "/reports" },
    { id: "automation", icon: <Bot size={16} />, label: "Automatización", href: "/automation" },
    { id: "users", icon: <UserMultiple size={16} />, label: "Usuarios", href: "/users" },
    { id: "technicians", icon: <Wrench size={16} />, label: "Técnicos", href: "/technicians/dashboard" },
  ];

  // Determinar qué sección está activa basado solo en el pathname
  const getActiveSection = (): string => {
    // Ordenar por especificidad: rutas más específicas primero
    if (pathname.startsWith("/settings")) return "settings";
    if (pathname.startsWith("/technicians")) return "technicians";
    if (pathname.startsWith("/users")) return "users";
    if (pathname.startsWith("/automation")) return "automation";
    if (pathname.startsWith("/reports")) return "reports";
    if (pathname.startsWith("/tickets")) return "tickets";
    if (pathname.startsWith("/inbox")) return "inbox";
    return "dashboard";
  };

  const currentActive = getActiveSection();

  return (
    <aside className={`flex flex-col items-center p-4 w-16 h-screen border-r ${
      theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-white border-gray-200'
    }`}>
      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map((item) => {
          const isActive = currentActive === item.id;
          return (
            <Link 
              key={item.id} 
              href={item.href} 
              className="w-full"
              prefetch={true} // Prefetch de rutas para carga más rápida
            >
              <IconNavButton
                isActive={isActive}
                theme={theme}
              >
                {item.icon}
              </IconNavButton>
            </Link>
          );
        })}
      </div>
      {/* Spacer to push bottom items down */}
      <div className="flex-1" />
      {/* Bottom section */}
      <div className="flex flex-col gap-2 w-full items-center">
        <Link href="/settings" className="w-full" prefetch={true}>
          <IconNavButton
            isActive={currentActive === "settings"}
            theme={theme}
          >
            <SettingsIcon size={16} />
          </IconNavButton>
        </Link>
        <div className="size-8">
          <AvatarCircle />
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Right Sidebar ----------------------------- */
function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
  theme,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
  theme: 'dark' | 'light';
}) {
  if (isCollapsed) {
    return (
      <div className="w-full flex justify-center transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-all duration-500 ${
            theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
          aria-label="Expandir sidebar"
        >
          <span className="inline-block rotate-180">
            <ChevronDownIcon size={16} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center h-10">
          <div className="px-2 py-1">
            <div className={`text-[18px] leading-[27px] font-semibold ${
              theme === 'dark' ? 'text-neutral-50' : 'text-gray-900'
            }`}>
              {title}
            </div>
          </div>
        </div>
        <div className="pr-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-all duration-500 ${
              theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
            aria-label="Colapsar sidebar"
          >
            <ChevronDownIcon size={16} className="-rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailSidebar({ activeSection, pathname }: { activeSection: string; pathname: string }) {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const content = getSidebarContent(activeSection, pathname);

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  const toggleCollapse = () => setIsCollapsed((s) => !s);

  return (
    <aside
      className={`flex flex-col items-start p-4 transition-all duration-500 h-screen ${
        isCollapsed ? "w-16 min-w-16 !px-0 justify-center" : "w-80"
      } ${theme === 'dark' ? 'bg-black' : 'bg-white border-l border-gray-200'}`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div className="flex flex-col gap-4 w-full h-full">
        <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} theme={theme} />

        <div
          className={`flex flex-col w-full flex-1 overflow-y-auto transition-all duration-500 ${
            isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          {content.sections.map((section, index) => (
            <MenuSection
              key={`${activeSection}-${index}`}
              section={section}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              isCollapsed={isCollapsed}
              pathname={pathname}
              theme={theme}
            />
          ))}
        </div>

        {!isCollapsed && (
          <UserMenu theme={theme} />
        )}
      </div>
    </aside>
  );
}

/* ------------------------------ Menu Elements ---------------------------- */
function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
  pathname,
  theme,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  pathname: string;
  theme: 'dark' | 'light';
}) {
  // Lógica mejorada: solo activo si es exacto o coincide con query params
  const isActive = item.href 
    ? (() => {
        const currentPath = pathname.split('?')[0];
        const currentQuery = pathname.split('?')[1];
        const itemPath = item.href.split('?')[0];
        const itemQuery = item.href.split('?')[1];
        
        // Si las rutas no coinciden, no está activo
        if (currentPath !== itemPath) return false;
        
        // Si ambas tienen query params, deben coincidir
        if (itemQuery && currentQuery) {
          const itemQueryKey = itemQuery.split('=')[0];
          const currentQueryKey = currentQuery.split('=')[0];
          return itemQueryKey === currentQueryKey;
        }
        
        // Si solo el item tiene query params, no está activo (a menos que la ruta actual también tenga)
        if (itemQuery && !currentQuery) return false;
        
        // Si coinciden las rutas y no hay query params en el item, está activo
        return true;
      })()
    : item.isActive;

  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else onItemClick?.();
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {item.href && !isCollapsed ? (
        <Link
          href={item.href}
          className={`rounded-lg cursor-pointer transition-all duration-500 flex items-center relative ${
            isActive
              ? theme === 'dark' ? "bg-neutral-800" : "bg-blue-100"
              : theme === 'dark' ? "hover:bg-neutral-800" : "hover:bg-gray-100"
          } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-4" : "w-full h-10 px-4 py-2"}`}
          style={{ transitionTimingFunction: softSpringEasing }}
          onClick={handleClick}
        >
          <div className="flex items-center justify-center shrink-0">{item.icon}</div>
          <div className="flex-1 relative transition-opacity duration-500 overflow-hidden opacity-100 ml-3">
            <div className={`text-[14px] leading-[20px] truncate ${
              theme === 'dark' ? 'text-neutral-50' : isActive ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {item.label}
            </div>
          </div>
          {item.hasDropdown && (
            <div className="flex items-center justify-center shrink-0 opacity-100 ml-2">
              <ChevronDownIcon
                size={16}
                className={`transition-transform duration-500 ${
                  theme === 'dark' ? 'text-neutral-50' : 'text-gray-600'
                }`}
                style={{
                  transitionTimingFunction: softSpringEasing,
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
          )}
        </Link>
      ) : (
        <div
          className={`rounded-lg cursor-pointer transition-all duration-500 flex items-center relative ${
            isActive
              ? theme === 'dark' ? "bg-neutral-800" : "bg-blue-100"
              : theme === 'dark' ? "hover:bg-neutral-800" : "hover:bg-gray-100"
          } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-4" : "w-full h-10 px-4 py-2"}`}
          style={{ transitionTimingFunction: softSpringEasing }}
          onClick={handleClick}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="flex items-center justify-center shrink-0">{item.icon}</div>
          <div
            className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
          >
            <div className={`text-[14px] leading-[20px] truncate ${
              theme === 'dark' ? 'text-neutral-50' : isActive ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {item.label}
            </div>
          </div>
          {item.hasDropdown && (
            <div
              className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"
              }`}
              style={{ transitionTimingFunction: softSpringEasing }}
            >
              <ChevronDownIcon
                size={16}
                className={`transition-transform duration-500 ${
                  theme === 'dark' ? 'text-neutral-50' : 'text-gray-600'
                }`}
                style={{
                  transitionTimingFunction: softSpringEasing,
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubMenuItem({
  item,
  onItemClick,
  pathname,
  theme,
}: {
  item: MenuItemT;
  onItemClick?: () => void;
  pathname: string;
  theme: 'dark' | 'light';
}) {
  // Para subitems, verificar exactamente
  const isActive = item.href ? (() => {
    const currentPath = pathname.split('?')[0];
    const itemPath = item.href.split('?')[0];
    
    if (currentPath === itemPath) {
      // Si el item tiene query params, verificar también
      if (item.href.includes('?')) {
        const itemQuery = item.href.split('?')[1];
        const currentQuery = pathname.split('?')[1];
        if (itemQuery && currentQuery) {
          return currentQuery.includes(itemQuery.split('=')[0]);
        }
      }
      return true;
    }
    return false;
  })() : false;

  return (
    <div className="w-full pl-9 pr-1 py-[1px]">
      {item.href ? (
        <Link
          href={item.href}
          prefetch={true}
          className={`h-10 w-full rounded-lg cursor-pointer transition-colors flex items-center px-3 py-1 ${
            isActive
              ? theme === 'dark' ? 'bg-neutral-800' : 'bg-blue-50'
              : theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
          }`}
          onClick={onItemClick}
        >
          <div className="flex-1 min-w-0">
            <div className={`text-[14px] leading-[18px] truncate ${
              theme === 'dark' ? 'text-neutral-300' : isActive ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {item.label}
            </div>
          </div>
        </Link>
      ) : (
        <div
          className={`h-10 w-full rounded-lg cursor-pointer transition-colors flex items-center px-3 py-1 ${
            theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
          }`}
          onClick={onItemClick}
        >
          <div className="flex-1 min-w-0">
            <div className={`text-[14px] leading-[18px] truncate ${
              theme === 'dark' ? 'text-neutral-300' : 'text-gray-700'
            }`}>
              {item.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
  pathname,
  theme,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
  pathname: string;
  theme: 'dark' | 'light';
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex items-center h-10 px-4">
          <div className={`text-[14px] ${
            theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
          }`}>
            {section.title}
          </div>
        </div>
      </div>
      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);

        return (
          <div key={itemKey} className="w-full flex flex-col">
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => {}}
              isCollapsed={isCollapsed}
              pathname={pathname}
              theme={theme}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="flex flex-col gap-1 mb-2">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() => {}}
                    pathname={pathname}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- Layout -------------------------------- */
function TwoLevelSidebar() {
  const pathname = usePathname();

  // Determinar sección activa basado solo en pathname (sin estado)
  const getActiveSection = (): string => {
    // Ordenar por especificidad: rutas más específicas primero
    if (pathname.startsWith("/settings")) return "settings";
    if (pathname.startsWith("/technicians")) return "technicians";
    if (pathname.startsWith("/users")) return "users";
    if (pathname.startsWith("/automation")) return "automation";
    if (pathname.startsWith("/reports")) return "reports";
    if (pathname.startsWith("/tickets")) return "tickets";
    if (pathname.startsWith("/inbox")) return "inbox";
    return "dashboard";
  };

  const activeSection = getActiveSection();

  return (
    <div className="flex flex-row h-screen">
      <IconNavigation pathname={pathname} />
      <DetailSidebar activeSection={activeSection} pathname={pathname} />
    </div>
  );
}

export function Sidebar() {
  return <TwoLevelSidebar />;
}
