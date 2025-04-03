"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DriversPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [currentDriver, setCurrentDriver] = useState<Driver>({
    id: Date.now().toString(),
    name: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseType: "",
  })

  type Driver = {
    id: string
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseType: string
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentDriver((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentDriver((prev) => ({ ...prev, [name]: value }))
  }

  const validateDriver = () => {
    if (!currentDriver.name) return "Name is required"
    if (!currentDriver.phone) return "Phone number is required"
    if (!currentDriver.licenseNumber) return "License number is required"
    if (!currentDriver.licenseType) return "License type is required"
    return null
  }

  const addDriver = () => {
    const validationError = validateDriver()
    if (validationError) {
      setError(validationError)
      return
    }

    setDrivers((prev) => [...prev, currentDriver])
    setCurrentDriver({
      id: Date.now().toString(),
      name: "",
      phone: "",
      email: "",
      licenseNumber: "",
      licenseType: "",
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentDriver.name) {
      const validationError = validateDriver()
      if (validationError) {
        setError(validationError)
        return
      }
      setDrivers((prev) => [...prev, currentDriver])
    }

    setIsLoading(true)
    setError("")

    try {
      // This is where you would normally save the drivers to your API
      // For demo purposes, we'll simulate saving after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Onboarding completed successfully!")

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Failed to save drivers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Step 3: Add Drivers</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/onboarding/vehicles">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">
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

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Driver list */}
          {drivers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Drivers ({drivers.length})</CardTitle>
                <CardDescription>Drivers you've added to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {driver.phone} • License: {driver.licenseNumber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add driver form */}
          <Card>
            <CardHeader>
              <CardTitle>Add a Driver</CardTitle>
              <CardDescription>Enter the details of your driver</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., John Doe"
                    value={currentDriver.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={currentDriver.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={currentDriver.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="e.g., DL12345678"
                    value={currentDriver.licenseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select
                    value={currentDriver.licenseType}
                    onValueChange={(value) => handleSelectChange("licenseType", value)}
                  >
                    <SelectTrigger id="licenseType">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Class A (Heavy Vehicles)</SelectItem>
                      <SelectItem value="B">Class B (Commercial Vehicles)</SelectItem>
                      <SelectItem value="C">Class C (Standard Vehicles)</SelectItem>
                      <SelectItem value="D">Class D (Passenger Vehicles)</SelectItem>
                      <SelectItem value="E">Class E (Specialized Vehicles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={addDriver}>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
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

