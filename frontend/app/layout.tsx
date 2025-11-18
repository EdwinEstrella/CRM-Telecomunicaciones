import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/sonner";

// Optimizar carga de fuente - solo cargar lo necesario
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Mejora FOUT (Flash of Unstyled Text)
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "CRM Profesional",
  description: "Sistema CRM completo con inbox omnicanal, tickets y automatización",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <NextAuthSessionProvider>
            {children}
            <Toaster />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

