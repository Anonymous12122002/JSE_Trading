"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import { useAuth } from "./auth-context"

export type Vehicle = {
  id: string
  userId: string
  name: string
  registrationNumber: string
  status: "active" | "idle" | "maintenance"
  location?: string
  lastUpdated?: string
  driver?: string
  fuelLevel?: number
  speed?: number
  coordinates?: {
    lat: number
    lng: number
  }
  odometer?: number
  nextService?: number
  
  // Additional RC details
  chassisNo: string
  engineNo: string
  make: string
  model: string
  registrationDate: Date
  taxValidUpto: string
  vehicleClass: string
  vehicleDescription: string
  fuelType: string
  emissionNorm: string
  color: string
  seatCapacity: number
  standingCapacity: number
  financier?: string
  insuranceCompany?: string
  insurancePolicyNo?: string
  insuranceValidUpto?: Date
  fitnessValidUpto?: Date
  puccNo?: string
  puccValidUpto?: Date
  registeringAuthority?: string
  
  type: string
  year: string
  createdAt: Date
  updatedAt: Date
  hasGPS?: boolean
}

type VehicleContextType = {
  vehicles: Vehicle[]
  loading: boolean
  addVehicle: (vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => Promise<Vehicle>
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setVehicles([])
      setLoading(false)
      return
    }

    // Subscribe to vehicles collection
    const q = query(collection(firestore, "vehicles"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleData: Vehicle[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        // Convert Firestore timestamps to Date objects
        const vehicle = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Vehicle
        vehicleData.push(vehicle)
      })
      setVehicles(vehicleData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addVehicle = async (vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("Must be logged in to add vehicles")

    const newVehicle = {
      ...vehicleData,
      userId: user.uid,
      status: vehicleData.status || "idle",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(firestore, "vehicles"), newVehicle)
    return { id: docRef.id, ...newVehicle } as Vehicle
  }

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    if (!user) throw new Error("Must be logged in to update vehicles")

    const vehicleRef = doc(firestore, "vehicles", id)
    await updateDoc(vehicleRef, {
      ...vehicleData,
      updatedAt: new Date(),
    })
  }

  const deleteVehicle = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete vehicles")

    await deleteDoc(doc(firestore, "vehicles", id))
  }

  return (
    <VehicleContext.Provider value={{ vehicles, loading, addVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error("useVehicles must be used within a VehicleProvider")
  }
  return context
} 