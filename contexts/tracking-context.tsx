"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import socket from "@/lib/socket"
import { useAuth } from "./auth-context"

type VehicleLocation = {
  vehicleId: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  timestamp: number
  status: "active" | "idle" | "maintenance"
}

type TrackingContextType = {
  vehicleLocations: Record<string, VehicleLocation>
  isConnected: boolean
  lastUpdated: Date | null
  sendLocationUpdate: (vehicleId: string, location: Omit<VehicleLocation, "vehicleId">) => void
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [vehicleLocations, setVehicleLocations] = useState<Record<string, VehicleLocation>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect()
      }
      setIsConnected(false)
      return
    }

    // Connect to socket when user is authenticated
    socket.connect()

    socket.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to tracking server")

      // Join user-specific room for updates
      socket.emit("join", { userId: user.uid })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from tracking server")
    })

    socket.on("locationUpdate", (data: VehicleLocation) => {
      setVehicleLocations((prev) => ({
        ...prev,
        [data.vehicleId]: data,
      }))
      setLastUpdated(new Date())
    })

    socket.on("batchLocationUpdate", (data: VehicleLocation[]) => {
      const newLocations = { ...vehicleLocations }
      data.forEach((location) => {
        newLocations[location.vehicleId] = location
      })
      setVehicleLocations(newLocations)
      setLastUpdated(new Date())
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("locationUpdate")
      socket.off("batchLocationUpdate")
      socket.disconnect()
    }
  }, [user])

  const sendLocationUpdate = (vehicleId: string, location: Omit<VehicleLocation, "vehicleId">) => {
    if (isConnected) {
      socket.emit("updateLocation", {
        vehicleId,
        ...location,
      })
    }
  }

  return (
    <TrackingContext.Provider value={{ vehicleLocations, isConnected, lastUpdated, sendLocationUpdate }}>
      {children}
    </TrackingContext.Provider>
  )
}

export function useTracking() {
  const context = useContext(TrackingContext)
  if (context === undefined) {
    throw new Error("useTracking must be used within a TrackingProvider")
  }
  return context
}

