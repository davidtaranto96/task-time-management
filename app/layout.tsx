import type { Metadata } from "next"
import { BottomNav } from "@/components/shared/BottomNav"
import "./globals.css"

export const metadata: Metadata = {
  title: "Enfoque — Tu sistema personal de organización",
  description: "Captura, organiza, prioriza, enfocate y sostené hábitos desde un solo lugar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="bg-ae-bg text-ae-text min-h-screen antialiased">
        <main className="pb-20"><div className="animate-fade-in">{children}</div></main>
        <BottomNav />
      </body>
    </html>
  )
}
