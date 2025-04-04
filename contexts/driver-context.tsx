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
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { firestore, storage } from "@/lib/firebase"
import { useAuth } from "./auth-context"

export type DriverDocument = {
  id: string
  licenseNumber: string
  licenseExpiry: Date
  medicalCertExpiry: Date
  certifications: string[]
}

export type DriverVehicleAssignment = {
  id: string
  vehicleId: string
  startDate: Date
  endDate?: Date
}

export type DriverPerformance = {
  safetyScore: number
  totalTrips: number
  totalDistance: number
  fuelEfficiency: number
  onTimeDeliveryRate: number
  idleTime: number
  complianceRate: number
}

export type Driver = {
  id: string
  userId: string // ID of the fleet manager who added this driver
  fullName: string
  email: string
  contactNumber: string
  driverId: string // Unique identifier for the driver
  profilePhotoUrl?: string
  hireDate: Date
  employmentType: "full-time" | "contractor"
  shiftTiming?: {
    start: string
    end: string
  }
  status: "active" | "inactive" | "suspended"
  documents: DriverDocument
  currentAssignment?: DriverVehicleAssignment
  performance: DriverPerformance
  createdAt: Date
  updatedAt: Date
}

type DriverContextType = {
  drivers: Driver[]
  loading: boolean
  addDriver: (driverData: Omit<Driver, "id" | "createdAt" | "updatedAt">) => Promise<Driver>
  updateDriver: (id: string, driverData: Partial<Driver>) => Promise<void>
  deleteDriver: (id: string) => Promise<void>
  uploadDriverPhoto: (id: string, file: File) => Promise<string>
  uploadDocument: (driverId: string, docType: string, file: File) => Promise<string>
}

const DriverContext = createContext<DriverContextType | undefined>(undefined)

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setDrivers([])
      setLoading(false)
      return
    }

    // Subscribe to drivers collection
    const q = query(collection(firestore, "drivers"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driverData: Driver[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        driverData.push({
          ...data,
          id: doc.id,
          hireDate: data.hireDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          documents: {
            ...data.documents,
            licenseExpiry: data.documents.licenseExpiry.toDate(),
            medicalCertExpiry: data.documents.medicalCertExpiry.toDate(),
          },
          currentAssignment: data.currentAssignment
            ? {
                ...data.currentAssignment,
                startDate: data.currentAssignment.startDate.toDate(),
                endDate: data.currentAssignment.endDate?.toDate(),
              }
            : undefined,
        } as Driver)
      })
      setDrivers(driverData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const uploadDriverPhoto = async (id: string, file: File) => {
    if (!user) throw new Error("Must be logged in to upload photos")

    const photoRef = ref(storage, `drivers/${id}/profile-photo`)
    await uploadBytes(photoRef, file)
    const photoUrl = await getDownloadURL(photoRef)

    const driverRef = doc(firestore, "drivers", id)
    await updateDoc(driverRef, { profilePhotoUrl: photoUrl })

    return photoUrl
  }

  const uploadDocument = async (driverId: string, docType: string, file: File) => {
    if (!user) throw new Error("Must be logged in to upload documents")

    const docRef = ref(storage, `drivers/${driverId}/documents/${docType}`)
    await uploadBytes(docRef, file)
    const docUrl = await getDownloadURL(docRef)

    const driverRef = doc(firestore, "drivers", driverId)
    await updateDoc(driverRef, {
      [`documents.${docType}Url`]: docUrl,
      updatedAt: Timestamp.now(),
    })

    return docUrl
  }

  const addDriver = async (driverData: Omit<Driver, "id" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("Must be logged in to add drivers")

    const newDriver = {
      ...driverData,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(firestore, "drivers"), newDriver)
    return { id: docRef.id, ...newDriver } as Driver
  }

  const updateDriver = async (id: string, driverData: Partial<Driver>) => {
    if (!user) throw new Error("Must be logged in to update drivers")

    const driverRef = doc(firestore, "drivers", id)
    await updateDoc(driverRef, {
      ...driverData,
      updatedAt: Timestamp.now(),
    })
  }

  const deleteDriver = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete drivers")

    // Delete profile photo if exists
    const driver = drivers.find(d => d.id === id)
    if (driver?.profilePhotoUrl) {
      const photoRef = ref(storage, `drivers/${id}/profile-photo`)
      await deleteObject(photoRef)
    }

    // Delete driver document
    await deleteDoc(doc(firestore, "drivers", id))
  }

  return (
    <DriverContext.Provider
      value={{ drivers, loading, addDriver, updateDriver, deleteDriver, uploadDriverPhoto, uploadDocument }}
    >
      {children}
    </DriverContext.Provider>
  )
}

export function useDrivers() {
  const context = useContext(DriverContext)
  if (context === undefined) {
    throw new Error("useDrivers must be used within a DriverProvider")
  }
  return context
} 