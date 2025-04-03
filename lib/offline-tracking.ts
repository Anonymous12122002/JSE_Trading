// Offline tracking utilities using IndexedDB

// Define the structure of a location update
export type LocationUpdate = {
  vehicleId: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  timestamp: number
  status: "active" | "idle" | "maintenance"
  tripId?: string
  driverId?: string
  odometer?: number
}

// Open IndexedDB database
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VehicleTrackingDB", 1)

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store for location updates
      if (!db.objectStoreNames.contains("locationUpdates")) {
        const store = db.createObjectStore("locationUpdates", { keyPath: "id", autoIncrement: true })
        store.createIndex("vehicleId", "vehicleId", { unique: false })
        store.createIndex("timestamp", "timestamp", { unique: false })
        store.createIndex("synced", "synced", { unique: false })
      }
    }
  })
}

// Save location update to IndexedDB
export const saveLocationUpdate = async (update: LocationUpdate): Promise<void> => {
  try {
    const db = await openDatabase()
    const transaction = db.transaction(["locationUpdates"], "readwrite")
    const store = transaction.objectStore("locationUpdates")

    // Add synced flag (false means not yet synced with server)
    const record = { ...update, synced: false }

    await new Promise<void>((resolve, reject) => {
      const request = store.add(record)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to save location update"))
    })
  } catch (error) {
    console.error("Error saving location update:", error)
    throw error
  }
}

// Get all unsynchronized location updates
export const getUnsyncedLocationUpdates = async (): Promise<Array<LocationUpdate & { id: number }>> => {
  try {
    const db = await openDatabase()
    const transaction = db.transaction(["locationUpdates"], "readonly")
    const store = transaction.objectStore("locationUpdates")
    const index = store.index("synced")

    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error("Failed to get unsynced location updates"))
    })
  } catch (error) {
    console.error("Error getting unsynced location updates:", error)
    return []
  }
}

// Mark location updates as synchronized
export const markLocationUpdatesAsSynced = async (ids: number[]): Promise<void> => {
  try {
    const db = await openDatabase()
    const transaction = db.transaction(["locationUpdates"], "readwrite")
    const store = transaction.objectStore("locationUpdates")

    await Promise.all(
      ids.map((id) => {
        return new Promise<void>((resolve, reject) => {
          const request = store.get(id)

          request.onsuccess = () => {
            const record = request.result
            if (record) {
              record.synced = true
              const updateRequest = store.put(record)
              updateRequest.onsuccess = () => resolve()
              updateRequest.onerror = () => reject(new Error("Failed to update location record"))
            } else {
              resolve()
            }
          }

          request.onerror = () => reject(new Error("Failed to get location record"))
        })
      }),
    )
  } catch (error) {
    console.error("Error marking location updates as synced:", error)
    throw error
  }
}

// Synchronize offline data with server
export const syncOfflineData = async (apiEndpoint: string): Promise<void> => {
  try {
    // Check if online
    if (!navigator.onLine) {
      console.log("Device is offline, skipping sync")
      return
    }

    // Get all unsynced location updates
    const updates = await getUnsyncedLocationUpdates()

    if (updates.length === 0) {
      console.log("No unsynced location updates to sync")
      return
    }

    console.log(`Syncing ${updates.length} location updates`)

    // Send updates to server
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updates: updates.map(({ id, synced, ...update }) => update),
      }),
    })

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    // Mark updates as synced
    await markLocationUpdatesAsSynced(updates.map((update) => update.id))

    console.log("Successfully synced location updates")
  } catch (error) {
    console.error("Error syncing offline data:", error)
    throw error
  }
}

// Set up automatic sync when online
export const setupOfflineSync = (apiEndpoint: string, intervalMs = 60000): (() => void) => {
  // Sync when coming back online
  const handleOnline = () => {
    console.log("Device is back online, syncing data")
    syncOfflineData(apiEndpoint).catch(console.error)
  }

  // Set up periodic sync
  const intervalId = setInterval(() => {
    if (navigator.onLine) {
      syncOfflineData(apiEndpoint).catch(console.error)
    }
  }, intervalMs)

  // Add event listener
  window.addEventListener("online", handleOnline)

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline)
    clearInterval(intervalId)
  }
}

