// OBD-II Integration utilities

export type OBDParameter =
  | "rpm"
  | "speed"
  | "engineLoad"
  | "coolantTemp"
  | "fuelLevel"
  | "fuelRate"
  | "intakeTemp"
  | "throttlePos"
  | "batteryVoltage"
  | "distanceMIL"

export type OBDData = {
  [key in OBDParameter]?: number
} & {
  timestamp: number
  vehicleId: string
}

// Mock OBD device class (in a real app, this would connect to a Bluetooth/WiFi OBD adapter)
export class OBDDevice {
  private connected = false
  private deviceId: string | null = null
  private vehicleId: string | null = null
  private listeners: Array<(data: OBDData) => void> = []
  private intervalId: number | null = null

  // Connect to OBD device
  async connect(deviceId: string, vehicleId: string): Promise<boolean> {
    try {
      // In a real app, this would use Web Bluetooth API or similar
      console.log(`Connecting to OBD device ${deviceId} for vehicle ${vehicleId}`)

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      this.connected = true
      this.deviceId = deviceId
      this.vehicleId = vehicleId

      console.log("Connected to OBD device")

      // Start data polling
      this.startPolling()

      return true
    } catch (error) {
      console.error("Error connecting to OBD device:", error)
      return false
    }
  }

  // Disconnect from OBD device
  disconnect(): void {
    if (!this.connected) return

    console.log("Disconnecting from OBD device")

    this.stopPolling()
    this.connected = false
    this.deviceId = null
    this.vehicleId = null
  }

  // Check if connected
  isConnected(): boolean {
    return this.connected
  }

  // Add data listener
  addListener(callback: (data: OBDData) => void): void {
    this.listeners.push(callback)
  }

  // Remove data listener
  removeListener(callback: (data: OBDData) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  // Start polling for data
  private startPolling(): void {
    if (this.intervalId !== null) return

    this.intervalId = window.setInterval(() => {
      if (!this.connected || !this.vehicleId) return

      // Generate mock OBD data
      const data: OBDData = {
        timestamp: Date.now(),
        vehicleId: this.vehicleId,
        rpm: Math.floor(Math.random() * 1500) + 800,
        speed: Math.floor(Math.random() * 80) + 20,
        engineLoad: Math.floor(Math.random() * 50) + 30,
        coolantTemp: Math.floor(Math.random() * 30) + 70,
        fuelLevel: Math.floor(Math.random() * 30) + 40,
        fuelRate: Math.floor(Math.random() * 10) + 5,
        intakeTemp: Math.floor(Math.random() * 20) + 30,
        throttlePos: Math.floor(Math.random() * 40) + 10,
        batteryVoltage: Math.random() * 1 + 12,
        distanceMIL: Math.floor(Math.random() * 1000),
      }

      // Notify listeners
      this.listeners.forEach((listener) => listener(data))
    }, 1000)
  }

  // Stop polling for data
  private stopPolling(): void {
    if (this.intervalId === null) return

    window.clearInterval(this.intervalId)
    this.intervalId = null
  }

  // Get specific OBD parameter (for one-time requests)
  async getParameter(parameter: OBDParameter): Promise<number | null> {
    if (!this.connected) return null

    // In a real app, this would send a request to the OBD device
    // For demo purposes, we'll return mock data
    switch (parameter) {
      case "rpm":
        return Math.floor(Math.random() * 1500) + 800
      case "speed":
        return Math.floor(Math.random() * 80) + 20
      case "fuelLevel":
        return Math.floor(Math.random() * 30) + 40
      default:
        return null
    }
  }
}

// Singleton OBD device instance
let obdInstance: OBDDevice | null = null

// Get OBD device instance
export const getOBDDevice = (): OBDDevice => {
  if (!obdInstance) {
    obdInstance = new OBDDevice()
  }
  return obdInstance
}

