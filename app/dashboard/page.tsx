"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Fuel,
  MapPin,
  Plus,
  RefreshCw,
  Route,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useTracking } from "@/contexts/tracking-context"
import { useVehicles } from "@/contexts/vehicle-context"
import GoogleMapComponent from "@/components/maps/google-map"
import { StatsCard } from "@/components/dashboard/StatsCard"
import type { StatsCardProps } from "@/components/dashboard/StatsCard"

// Mock data for recent trips
const mockTrips = [
  {
    id: "t1",
    vehicle: "Toyota Hilux (ABC 123)",
    driver: "John Doe",
    startLocation: "Johannesburg",
    endLocation: "Pretoria",
    startTime: "Today, 08:30 AM",
    endTime: "Today, 10:15 AM",
    distance: "58 km",
    status: "completed",
  },
  {
    id: "t2",
    vehicle: "Ford Ranger (XYZ 789)",
    driver: "Jane Smith",
    startLocation: "Pretoria",
    endLocation: "Centurion",
    startTime: "Today, 12:45 PM",
    endTime: "In progress",
    distance: "25 km",
    status: "in-progress",
  },
  {
    id: "t3",
    vehicle: "Toyota Hilux (ABC 123)",
    driver: "John Doe",
    startLocation: "Pretoria",
    endLocation: "Johannesburg",
    startTime: "Yesterday, 04:30 PM",
    endTime: "Yesterday, 06:10 PM",
    distance: "58 km",
    status: "completed",
  },
]

// Mock data for statistics
const mockStats = {
  totalVehicles: 3,
  activeVehicles: 1,
  totalDrivers: 2,
  totalTrips: 25,
  totalDistance: "1,245 km",
  fuelUsed: "210 liters",
  fuelEfficiency: "5.9 km/l",
  totalExpenses: "R 12,450",
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { isConnected } = useTracking()
  const { vehicles } = useVehicles()
  const [refreshing, setRefreshing] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const stats: StatsCardProps[] = [
    {
      type: "vehicles",
      title: "Total Vehicles",
      value: "3",
      subtitle: "1 active now",
      details: {
        "Active Vehicles": "1",
        "Idle Vehicles": "1",
        "In Maintenance": "1",
        "Total Distance Today": "450 km",
        "Average Speed": "45 km/h",
        "Last Location": "Mumbai, Maharashtra",
        "Most Active Driver": "John Doe",
        "Next Maintenance Due": "15 days",
      },
    },
    {
      type: "trips",
      title: "Total Trips",
      value: "25",
      subtitle: "1,245 km traveled",
      details: {
        "Completed Trips": "20",
        "Ongoing Trips": "3",
        "Pending Trips": "2",
        "Total Distance": "1,245 km",
        "Average Trip Distance": "49.8 km",
        "On-Time Delivery Rate": "95%",
        "Most Common Route": "Mumbai - Pune",
        "Peak Hours": "9 AM - 11 AM",
      },
    },
    {
      type: "fuel",
      title: "Fuel Usage",
      value: "210 liters",
      subtitle: "5.9 km/l average",
      details: {
        "Total Consumption": "210 liters",
        "Fuel Efficiency": "5.9 km/l",
        "Cost per Liter": "₹96.50",
        "Monthly Fuel Cost": "₹20,265",
        "Last Refuel": "Today, 10:30 AM",
        "Refuel Amount": "45 liters",
        "Best Performing Vehicle": "KA01AB1234",
        "Fuel Alerts": "1 vehicle low on fuel",
      },
      vehicleFuelData: [
        {
          name: "Toyota Hilux",
          consumption: 85,
          efficiency: 11.2,
          cost: 8500,
        },
        {
          name: "Ford Ranger",
          consumption: 65,
          efficiency: 9.8,
          cost: 6500,
        },
        {
          name: "Isuzu D-Max",
          consumption: 60,
          efficiency: 10.5,
          cost: 6000,
        },
      ],
    },
    {
      type: "expenses",
      title: "Total Expenses",
      value: "₹12,450",
      subtitle: "This month",
      details: {
        "Fuel Expenses": "₹20,265",
        "Maintenance Cost": "₹15,000",
        "Driver Allowances": "₹8,500",
        "Toll Charges": "₹4,200",
        "Insurance Premium": "₹12,000",
        "Repairs": "₹6,800",
        "Other Expenses": "₹3,450",
        "Cost per KM": "₹9.80",
      },
    },
  ]

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Function to simulate refreshing data
  const refreshData = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  // Update the useEffect to use real vehicles
  useEffect(() => {
    if (!isConnected) return

    // This would normally come from the socket connection
    // For demo purposes, we're simulating location updates
    const interval = setInterval(() => {
      vehicles.forEach((vehicle) => {
        // Small random movement
        const latChange = (Math.random() - 0.5) * 0.01
        const lngChange = (Math.random() - 0.5) * 0.01

        // Update vehicle location
        const updatedLocation = {
          vehicleId: vehicle.id,
          latitude: vehicle.coordinates?.lat + latChange || 0,
          longitude: vehicle.coordinates?.lng + lngChange || 0,
          speed: vehicle.status === "active" ? Math.floor(Math.random() * 30) + 50 : 0,
          heading: Math.floor(Math.random() * 360),
          timestamp: Date.now(),
          status: vehicle.status as "active" | "idle" | "maintenance",
        }

        // In a real app, this would be handled by the socket connection
        // For demo, we're directly updating the context
        if (typeof window !== "undefined") {
          const event = new CustomEvent("locationUpdate", { detail: updatedLocation })
          window.dispatchEvent(event)
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isConnected, vehicles])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your fleet in real-time and track vehicle performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/trips/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.type} {...stat} />
        ))}
      </div>

      {/* Live tracking map */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Live Vehicle Tracking</CardTitle>
          <CardDescription>Real-time location of all your vehicles</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-hidden">
            <GoogleMapComponent height="400px" vehicleIds={vehicles.map((v) => v.id)} />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles and trips tabs */}
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="trips">Recent Trips</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{vehicle.name}</CardTitle>
                      <CardDescription>{vehicle.registrationNumber}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        vehicle.status === "active" ? "default" : vehicle.status === "idle" ? "outline" : "destructive"
                      }
                    >
                      {vehicle.status === "active" ? "Active" : vehicle.status === "idle" ? "Idle" : "Maintenance"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{vehicle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Updated {vehicle.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Driver: {vehicle.driver}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Fuel Level</span>
                      <span>{vehicle.fuelLevel}%</span>
                    </div>
                    <Progress value={vehicle.fuelLevel} className="h-2" />
                  </div>
                  {vehicle.status === "active" && (
                    <div className="rounded-md bg-muted p-2 text-center">
                      <span className="text-sm font-medium">Current Speed: {vehicle.speed} km/h</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/vehicles/${vehicle.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/vehicles">
                View All Vehicles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="trips" className="space-y-4">
          <div className="rounded-lg border">
            <div className="grid grid-cols-1 divide-y">
              {mockTrips.map((trip) => (
                <div key={trip.id} className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={trip.status === "completed" ? "default" : "outline"}>
                          {trip.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                        <h3 className="font-medium">{trip.vehicle}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{trip.driver}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm md:text-right">
                      <div className="flex items-center gap-1 md:justify-end">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {trip.startLocation} → {trip.endLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:justify-end">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {trip.startTime} → {trip.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:justify-end">
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <span>{trip.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/trips">
                View All Trips <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alerts and notifications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
        <Alert variant="default" className="border-amber-500 bg-amber-50 text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Maintenance Due</AlertTitle>
          <AlertDescription>Isuzu D-Max (DEF 456) is due for service in 3 days or 500 km.</AlertDescription>
        </Alert>
        <Alert variant="default" className="border-red-500 bg-red-50 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Fuel Alert</AlertTitle>
          <AlertDescription>Ford Ranger (XYZ 789) is running low on fuel (25% remaining).</AlertDescription>
        </Alert>
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Trip Completed</AlertTitle>
          <AlertDescription>
            Toyota Hilux (ABC 123) completed trip from Johannesburg to Pretoria (58 km).
          </AlertDescription>
        </Alert>
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
            <Link href="/dashboard/trips/new">
              <Route className="h-5 w-5" />
              <div className="font-medium">Record Trip</div>
              <div className="text-xs text-muted-foreground">Log a new trip with details</div>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
            <Link href="/dashboard/expenses/new">
              <CreditCard className="h-5 w-5" />
              <div className="font-medium">Add Expense</div>
              <div className="text-xs text-muted-foreground">Record fuel or maintenance costs</div>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
            <Link href="/dashboard/reports">
              <BarChart3 className="h-5 w-5" />
              <div className="font-medium">Generate Report</div>
              <div className="text-xs text-muted-foreground">Create custom reports</div>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
            <Link href="/dashboard/calendar">
              <Calendar className="h-5 w-5" />
              <div className="font-medium">Schedule</div>
              <div className="text-xs text-muted-foreground">View and plan upcoming trips</div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

