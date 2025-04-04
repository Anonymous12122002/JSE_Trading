import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { TrackingProvider } from "@/contexts/tracking-context"
import { VehicleProvider } from "@/contexts/vehicle-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "JSE TRADING - Vehicle Tracking System",
  description: "Real-time GPS vehicle tracking system for fleet management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <VehicleProvider>
              <TrackingProvider>
                {children}
                <Toaster />
              </TrackingProvider>
            </VehicleProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'