"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import { useAuth } from "./auth-context"

export type UserSettings = {
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  smsNotifications: boolean
  distanceUnit: "km" | "miles"
  fuelUnit: "liters" | "gallons"
  maintenanceThreshold: number
  fuelEfficiencyTarget: number
  lowFuelAlert: number
  integrations: {
    googleMapsKey?: string
    paymentGatewayKey?: string
    webhookUrl?: string
  }
}

type SettingsContextType = {
  settings: UserSettings | null
  loading: boolean
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

const defaultSettings: UserSettings = {
  theme: "system",
  emailNotifications: true,
  smsNotifications: false,
  distanceUnit: "km",
  fuelUnit: "liters",
  maintenanceThreshold: 5000,
  fuelEfficiencyTarget: 10,
  lowFuelAlert: 20,
  integrations: {},
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setSettings(null)
      setLoading(false)
      return
    }

    // Subscribe to settings document
    const unsubscribe = onSnapshot(
      doc(firestore, "settings", user.uid),
      (doc) => {
        if (doc.exists()) {
          setSettings(doc.data() as UserSettings)
        } else {
          // Create default settings for new users
          setDoc(doc.ref, defaultSettings)
          setSettings(defaultSettings)
        }
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) throw new Error("Must be logged in to update settings")

    const settingsRef = doc(firestore, "settings", user.uid)
    await updateDoc(settingsRef, newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
} 