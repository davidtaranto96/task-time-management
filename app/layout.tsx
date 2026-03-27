import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { BottomNav } from "@/components/shared/BottomNav"
import OnboardingWrapper from "@/components/onboarding/OnboardingWrapper"
import { TimerProvider } from "@/components/shared/TimerProvider"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-title',
  display: 'swap',
})

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
      <body className={`bg-ae-bg text-ae-text min-h-screen antialiased ${dmSans.variable}`}>
        <TimerProvider>
          <OnboardingWrapper>
            <main className="pb-20"><div className="animate-fade-in">{children}</div></main>
            <BottomNav />
          </OnboardingWrapper>
        </TimerProvider>
      </body>
    </html>
  )
}
