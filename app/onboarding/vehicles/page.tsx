"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Plus, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VehiclesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>({
    id: Date.now().toString(),
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    type: "",
    fuelType: "",
  })

  type Vehicle = {
    id: string
    registrationNumber: string
    make: string
    model: string
    year: string
    type: string
    fuelType: string
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }))
  }

  const validateVehicle = () => {
    if (!currentVehicle.registrationNumber) return "Registration number is required"
    if (!currentVehicle.make) return "Make is required"
    if (!currentVehicle.model) return "Model is required"
    if (!currentVehicle.year) return "Year is required"
    if (!currentVehicle.type) return "Vehicle type is required"
    if (!currentVehicle.fuelType) return "Fuel type is required"
    return null
  }

  const addVehicle = () => {
    const validationError = validateVehicle()
    if (validationError) {
      setError(validationError)
      return
    }

    setVehicles((prev) => [...prev, currentVehicle])
    setCurrentVehicle({
      id: Date.now().toString(),
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      type: "",
      fuelType: "",
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentVehicle.registrationNumber) {
      const validationError = validateVehicle()
      if (validationError) {
        setError(validationError)
        return
      }
      setVehicles((prev) => [...prev, currentVehicle])
    }

    if (vehicles.length === 0 && !currentVehicle.registrationNumber) {
      setError("Please add at least one vehicle")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // This is where you would normally save the vehicles to your API
      // For demo purposes, we'll simulate saving after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to the next step
      router.push("/onboarding/drivers")
    } catch (err) {
      setError("Failed to save vehicles. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Step 2: Add Vehicles</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/onboarding">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/onboarding/drivers">
              Skip <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Vehicle list */}
          {vehicles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Vehicles ({vehicles.length})</CardTitle>
                <CardDescription>Vehicles you've added to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.registrationNumber} • {vehicle.type} • {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add vehicle form */}
          <Card>
            <CardHeader>
              <CardTitle>Add a Vehicle</CardTitle>
              <CardDescription>Enter the details of your vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    placeholder="e.g., ABC123"
                    value={currentVehicle.registrationNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    placeholder="e.g., Toyota"
                    value={currentVehicle.make}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., Hilux"
                    value={currentVehicle.model}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    placeholder="e.g., 2022"
                    value={currentVehicle.year}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Select value={currentVehicle.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={currentVehicle.fuelType}
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
                  >
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={addVehicle}>
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

