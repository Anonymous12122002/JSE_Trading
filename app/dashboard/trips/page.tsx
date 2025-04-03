"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Check,
  Download,
  Filter,
  Fuel,
  MoreHorizontal,
  Plus,
  Route,
  Search,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock data for trips
const mockTrips = [
  {
    id: "t1",
    vehicle: "Toyota Hilux",
    vehicleReg: "ABC 123",
    driver: "John Doe",
    startLocation: "Johannesburg",
    endLocation: "Pretoria",
    startTime: "2023-04-02T08:30:00",
    endTime: "2023-04-02T10:15:00",
    distance: 58,
    fuelUsed: 5.2,
    status: "completed",
    purpose: "Delivery",
    notes: "Delivered packages to Pretoria office",
  },
  {
    id: "t2",
    vehicle: "Ford Ranger",
    vehicleReg: "XYZ 789",
    driver: "Jane Smith",
    startLocation: "Pretoria",
    endLocation: "Centurion",
    startTime: "2023-04-02T12:45:00",
    endTime: null,
    distance: 25,
    fuelUsed: null,
    status: "in-progress",
    purpose: "Client Meeting",
    notes: "Meeting with client in Centurion",
  },
  {
    id: "t3",
    vehicle: "Toyota Hilux",
    vehicleReg: "ABC 123",
    driver: "John Doe",
    startLocation: "Pretoria",
    endLocation: "Johannesburg",
    startTime: "2023-04-01T16:30:00",
    endTime: "2023-04-01T18:10:00",
    distance: 58,
    fuelUsed: 5.5,
    status: "completed",
    purpose: "Return Trip",
    notes: "Return to headquarters",
  },
  {
    id: "t4",
    vehicle: "Volkswagen Transporter",
    vehicleReg: "GHI 789",
    driver: "Mike Johnson",
    startLocation: "Johannesburg",
    endLocation: "Soweto",
    startTime: "2023-04-01T09:15:00",
    endTime: "2023-04-01T10:30:00",
    distance: 28,
    fuelUsed: 3.2,
    status: "completed",
    purpose: "Delivery",
    notes: "Delivered supplies to Soweto warehouse",
  },
  {
    id: "t5",
    vehicle: "Toyota Land Cruiser",
    vehicleReg: "JKL 012",
    driver: "Sarah Williams",
    startLocation: "Johannesburg",
    endLocation: "Kruger National Park",
    startTime: "2023-03-30T06:00:00",
    endTime: "2023-03-30T11:45:00",
    distance: 420,
    fuelUsed: 42.5,
    status: "completed",
    purpose: "Site Visit",
    notes: "Inspection of remote facilities",
  },
]

// Helper function to format date
function formatDate(dateString: string | null) {
  if (!dateString) return "In progress"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddTripDialog, setShowAddTripDialog] = useState(false)
  const [newTrip, setNewTrip] = useState({
    vehicle: "",
    driver: "",
    startLocation: "",
    endLocation: "",
    purpose: "",
    notes: "",
  })

  // Filter trips based on search query and status filter
  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.endLocation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || trip.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTrip((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTrip((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTrip = () => {
    // In a real app, this would save to a database
    console.log("Adding new trip:", newTrip)
    setShowAddTripDialog(false)
    // Reset form
    setNewTrip({
      vehicle: "",
      driver: "",
      startLocation: "",
      endLocation: "",
      purpose: "",
      notes: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trips</h1>
          <p className="text-muted-foreground">Track and manage vehicle trips and journeys.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAddTripDialog} onOpenChange={setShowAddTripDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Trip</DialogTitle>
                <DialogDescription>Enter the details of the trip you want to record.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle</Label>
                    <Select value={newTrip.vehicle} onValueChange={(value) => handleSelectChange("vehicle", value)}>
                      <SelectTrigger id="vehicle">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Toyota Hilux (ABC 123)">Toyota Hilux (ABC 123)</SelectItem>
                        <SelectItem value="Ford Ranger (XYZ 789)">Ford Ranger (XYZ 789)</SelectItem>
                        <SelectItem value="Isuzu D-Max (DEF 456)">Isuzu D-Max (DEF 456)</SelectItem>
                        <SelectItem value="Volkswagen Transporter (GHI 789)">
                          Volkswagen Transporter (GHI 789)
                        </SelectItem>
                        <SelectItem value="Toyota Land Cruiser (JKL 012)">Toyota Land Cruiser (JKL 012)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver">Driver</Label>
                    <Select value={newTrip.driver} onValueChange={(value) => handleSelectChange("driver", value)}>
                      <SelectTrigger id="driver">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                        <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocation">Start Location</Label>
                    <Input
                      id="startLocation"
                      name="startLocation"
                      value={newTrip.startLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Johannesburg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endLocation">End Location</Label>
                    <Input
                      id="endLocation"
                      name="endLocation"
                      value={newTrip.endLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Pretoria"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Trip Purpose</Label>
                  <Select value={newTrip.purpose} onValueChange={(value) => handleSelectChange("purpose", value)}>
                    <SelectTrigger id="purpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                      <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                      <SelectItem value="Site Visit">Site Visit</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newTrip.notes}
                    onChange={handleInputChange}
                    className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Additional details about the trip..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddTripDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTrip}>Start Trip</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trips..."
            className="w-full appearance-none pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trips</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Trip list */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left font-medium">Trip Details</th>
                <th className="h-12 px-4 text-left font-medium">Vehicle & Driver</th>
                <th className="h-12 px-4 text-left font-medium">Route</th>
                <th className="h-12 px-4 text-left font-medium">Time</th>
                <th className="h-12 px-4 text-left font-medium">Distance & Fuel</th>
                <th className="h-12 px-4 text-left font-medium">Status</th>
                <th className="h-12 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="border-b">
                  <td className="p-4">
                    <div className="font-medium">{trip.purpose}</div>
                    <div className="text-xs text-muted-foreground">
                      {trip.notes.length > 30 ? trip.notes.substring(0, 30) + "..." : trip.notes}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{trip.vehicle}</div>
                        <div className="text-xs text-muted-foreground">{trip.vehicleReg}</div>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{trip.driver}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>
                          {trip.startLocation} → {trip.endLocation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{formatDate(trip.startTime)}</div>
                        <div className="text-xs text-muted-foreground">
                          {trip.endTime ? `to ${formatDate(trip.endTime)}` : "In progress"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>{trip.distance} km</div>
                    {trip.fuelUsed && (
                      <div className="text-xs text-muted-foreground">
                        {trip.fuelUsed} L ({(trip.distance / trip.fuelUsed).toFixed(1)} km/L)
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={trip.status === "completed" ? "default" : "outline"}>
                      {trip.status === "completed" ? "Completed" : "In Progress"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/trips/${trip.id}`}>
                            <Route className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {trip.status === "in-progress" && (
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Complete Trip
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Fuel className="mr-2 h-4 w-4" />
                          Add Expenses
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTrips.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Route className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No trips found</h3>
          <p className="mt-2 text-center text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Record your first trip to start tracking"}
          </p>
          <Button className="mt-4" onClick={() => setShowAddTripDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Trip
          </Button>
        </div>
      )}
    </div>
  )
}

