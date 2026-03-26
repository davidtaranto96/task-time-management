import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arquitectura de Enfoque",
  description: "Filtro de Prioridad de Élite — gestiona impacto, no tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-ae-bg text-ae-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
