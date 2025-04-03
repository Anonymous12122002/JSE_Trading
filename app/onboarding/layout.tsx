import type React from "react"
import { Truck } from "lucide-react"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">JSE TRADING</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Complete Your Account Setup</h1>
          <p className="text-muted-foreground">
            Let's get your vehicle tracking system set up. Follow these steps to get started.
          </p>
        </div>

        {children}
      </main>
    </div>
  )
}

