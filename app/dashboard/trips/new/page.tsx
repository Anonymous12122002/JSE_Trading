"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Calendar, Check, Clock, Loader2, MapPin, Route, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LocationInput from "@/components/forms/location-input"
import OdometerUpload from "@/components/forms/odometer-upload"
import GoogleMapComponent from "@/components/maps/google-map"

// Mock data for vehicles and drivers
const mockVehicles = [
  { id: "v1", name: "Toyota Hilux", registrationNumber: "ABC 123" },
  { id: "v2", name: "Ford Ranger", registrationNumber: "XYZ 789" },
  { id: "v3", name: "Isuzu D-Max", registrationNumber: "DEF 456" },
]

const mockDrivers = [
  { id: "d1", name: "John Doe" },
  { id: "d2", name: "Jane Smith" },
  { id: "d3", name: "Mike Johnson" },
]

declare global {
  interface Window {
    google: any
  }
}

export default function NewTripPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [tripData, setTripData] = useState({
    vehicleId: "",
    driverId: "",
    startLocation: "",
    startLocationDetails: null as google.maps.places.PlaceResult | null,
    endLocation: "",
    endLocationDetails: null as google.maps.places.PlaceResult | null,
    startOdometerReading: "",
    startOdometerPhoto: "",
    purpose: "",
    notes: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTripData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTripData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (name: string, value: string, placeDetails?: google.maps.places.PlaceResult) => {
    setTripData((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Details`]: placeDetails || null,
    }))
  }

  const handleOdometerPhotoChange = (url: string) => {
    setTripData((prev) => ({ ...prev, startOdometerPhoto: url }))
  }

  const validateForm = () => {
    if (!tripData.vehicleId) return "Please select a vehicle"
    if (!tripData.driverId) return "Please select a driver"
    if (!tripData.startLocation) return "Please enter a start location"
    if (!tripData.startOdometerReading) return "Please enter the starting odometer reading"
    if (!tripData.purpose) return "Please select a trip purpose"
    return ""
  }

  const handleStartTrip = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would save to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to the trips page
      router.push("/dashboard/trips")
    } catch (err) {
      console.error("Error starting trip:", err)
      setError("Failed to start trip. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedVehicle = () => {
    return mockVehicles.find((v) => v.id === tripData.vehicleId)
  }

  const getSelectedDriver = () => {
    return mockDrivers.find((d) => d.id === tripData.driverId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/dashboard/trips">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Record New Trip</h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Trip Details</TabsTrigger>
          <TabsTrigger value="route">Route & Map</TabsTrigger>
          <TabsTrigger value="odometer">Odometer Reading</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle</Label>
                  <Select value={tripData.vehicleId} onValueChange={(value) => handleSelectChange("vehicleId", value)}>
                    <SelectTrigger id="vehicleId">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverId">Driver</Label>
                  <Select value={tripData.driverId} onValueChange={(value) => handleSelectChange("driverId", value)}>
                    <SelectTrigger id="driverId">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={tripData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={tripData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="purpose">Trip Purpose</Label>
                  <Select value={tripData.purpose} onValueChange={(value) => handleSelectChange("purpose", value)}>
                    <SelectTrigger id="purpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="client_meeting">Client Meeting</SelectItem>
                      <SelectItem value="site_visit">Site Visit</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Additional details about the trip..."
                    value={tripData.notes}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard/trips")}>
                Cancel
              </Button>
              <Button onClick={() => setActiveTab("route")}>Next: Route Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="route" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Information</CardTitle>
              <CardDescription>Enter the start and end locations for this trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Start Location</Label>
                  <LocationInput
                    value={tripData.startLocation}
                    onChange={(value, placeDetails) => handleLocationChange("startLocation", value, placeDetails)}
                    placeholder="Enter start location"
                    useCurrentLocation
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endLocation">End Location (Optional)</Label>
                  <LocationInput
                    value={tripData.endLocation}
                    onChange={(value, placeDetails) => handleLocationChange("endLocation", value, placeDetails)}
                    placeholder="Enter end location"
                  />
                </div>
              </div>

              {/* Map preview */}
              {(tripData.startLocationDetails || tripData.endLocationDetails) && (
                <div className="mt-4">
                  <Label>Route Preview</Label>
                  <div className="mt-2 rounded-md border overflow-hidden">
                    <GoogleMapComponent
                      height="300px"
                      showDirections={!!(tripData.startLocationDetails && tripData.endLocationDetails)}
                      origin={tripData.startLocationDetails?.geometry?.location?.toJSON()}
                      destination={tripData.endLocationDetails?.geometry?.location?.toJSON()}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("odometer")}>Next: Odometer Reading</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="odometer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Odometer Reading</CardTitle>
              <CardDescription>Record the starting odometer reading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startOdometerReading">Starting Odometer Reading (km)</Label>
                  <div className="flex items-center">
                    <Route className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startOdometerReading"
                      name="startOdometerReading"
                      type="number"
                      placeholder="e.g., 45280"
                      value={tripData.startOdometerReading}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <OdometerUpload
                    value={tripData.startOdometerPhoto}
                    onChange={handleOdometerPhotoChange}
                    label="Odometer Photo (Optional)"
                    type="start"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("route")}>
                Back
              </Button>
              <Button onClick={handleStartTrip} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Trip...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Start Trip
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trip Summary */}
      {tripData.vehicleId && tripData.driverId && (
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
            <CardDescription>Review your trip details before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Vehicle:</span>
                  <span className="text-sm">
                    {getSelectedVehicle()?.name} ({getSelectedVehicle()?.registrationNumber})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Driver:</span>
                  <span className="text-sm">{getSelectedDriver()?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Start Date/Time:</span>
                  <span className="text-sm">
                    {tripData.startDate} at {tripData.startTime}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">From:</span>
                  <span className="text-sm">{tripData.startLocation}</span>
                </div>
                {tripData.endLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">To:</span>
                    <span className="text-sm">{tripData.endLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Starting Odometer:</span>
                  <span className="text-sm">{tripData.startOdometerReading} km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

