"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Clock,
  Download,
  Filter,
  Fuel,
  MapPin,
  MoreHorizontal,
  Plus,
  Route,
  Search,
  Settings,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// Mock data for vehicles
const mockVehicles = [
  {
    id: "v1",
    name: "Toyota Hilux",
    registrationNumber: "ABC 123",
    status: "active",
    location: "Johannesburg CBD",
    lastUpdated: "2 minutes ago",
    driver: "John Doe",
    fuelLevel: 75,
    odometer: 45280,
    nextService: 5000,
    type: "Truck",
    make: "Toyota",
    model: "Hilux",
    year: 2021,
  },
  {
    id: "v2",
    name: "Ford Ranger",
    registrationNumber: "XYZ 789",
    status: "idle",
    location: "Pretoria East",
    lastUpdated: "15 minutes ago",
    driver: "Jane Smith",
    fuelLevel: 45,
    odometer: 32150,
    nextService: 2500,
    type: "Truck",
    make: "Ford",
    model: "Ranger",
    year: 2020,
  },
  {
    id: "v3",
    name: "Isuzu D-Max",
    registrationNumber: "DEF 456",
    status: "maintenance",
    location: "Workshop - Midrand",
    lastUpdated: "2 hours ago",
    driver: "Unassigned",
    fuelLevel: 30,
    odometer: 78920,
    nextService: 0,
    type: "Truck",
    make: "Isuzu",
    model: "D-Max",
    year: 2019,
  },
  {
    id: "v4",
    name: "Volkswagen Transporter",
    registrationNumber: "GHI 789",
    status: "active",
    location: "Sandton",
    lastUpdated: "5 minutes ago",
    driver: "Mike Johnson",
    fuelLevel: 60,
    odometer: 15780,
    nextService: 8000,
    type: "Van",
    make: "Volkswagen",
    model: "Transporter",
    year: 2022,
  },
  {
    id: "v5",
    name: "Toyota Land Cruiser",
    registrationNumber: "JKL 012",
    status: "idle",
    location: "Centurion",
    lastUpdated: "45 minutes ago",
    driver: "Sarah Williams",
    fuelLevel: 25,
    odometer: 62340,
    nextService: 1200,
    type: "SUV",
    make: "Toyota",
    model: "Land Cruiser",
    year: 2020,
  },
]

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    type: "",
  })

  // Filter vehicles based on search query and status filter
  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVehicle((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewVehicle((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddVehicle = () => {
    // In a real app, this would save to a database
    console.log("Adding new vehicle:", newVehicle)
    setShowAddVehicleDialog(false)
    // Reset form
    setNewVehicle({
      name: "",
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      type: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage and monitor your fleet of vehicles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>Enter the details of the vehicle you want to add to your fleet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Vehicle Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newVehicle.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Toyota Hilux"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={newVehicle.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., ABC 123"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      name="make"
                      value={newVehicle.make}
                      onChange={handleInputChange}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      value={newVehicle.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Hilux"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={newVehicle.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2022"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Vehicle Type</Label>
                    <Select value={newVehicle.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddVehicleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVehicle}>Add Vehicle</Button>
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
            placeholder="Search vehicles..."
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
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Vehicle list */}
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Showing {filteredVehicles.length} of {mockVehicles.length} vehicles
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{vehicle.name}</CardTitle>
                      <CardDescription>{vehicle.registrationNumber}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Route className="mr-2 h-4 w-4" />
                          Record Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Assign Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Fuel className="mr-2 h-4 w-4" />
                          Record Refueling
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Vehicle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        vehicle.status === "active" ? "default" : vehicle.status === "idle" ? "outline" : "destructive"
                      }
                    >
                      {vehicle.status === "active" ? "Active" : vehicle.status === "idle" ? "Idle" : "Maintenance"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated {vehicle.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{vehicle.location}</span>
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
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-muted p-2">
                      <div className="text-xs text-muted-foreground">Odometer</div>
                      <div>{vehicle.odometer} km</div>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <div className="text-xs text-muted-foreground">Next Service</div>
                      <div>{vehicle.nextService > 0 ? `In ${vehicle.nextService} km` : "Due Now"}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/vehicles/${vehicle.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium">Vehicle</th>
                    <th className="h-12 px-4 text-left font-medium">Status</th>
                    <th className="h-12 px-4 text-left font-medium">Driver</th>
                    <th className="h-12 px-4 text-left font-medium">Location</th>
                    <th className="h-12 px-4 text-left font-medium">Fuel</th>
                    <th className="h-12 px-4 text-left font-medium">Odometer</th>
                    <th className="h-12 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b">
                      <td className="p-4">
                        <div className="font-medium">{vehicle.name}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.registrationNumber}</div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            vehicle.status === "active"
                              ? "default"
                              : vehicle.status === "idle"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {vehicle.status === "active" ? "Active" : vehicle.status === "idle" ? "Idle" : "Maintenance"}
                        </Badge>
                      </td>
                      <td className="p-4">{vehicle.driver}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{vehicle.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex w-24 items-center gap-2">
                          <Progress value={vehicle.fuelLevel} className="h-2" />
                          <span className="text-xs">{vehicle.fuelLevel}%</span>
                        </div>
                      </td>
                      <td className="p-4">{vehicle.odometer} km</td>
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
                              <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                                <Truck className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Route className="mr-2 h-4 w-4" />
                              Record Trip
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Fuel className="mr-2 h-4 w-4" />
                              Record Refueling
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
        </TabsContent>
      </Tabs>

      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Truck className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No vehicles found</h3>
          <p className="mt-2 text-center text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Add your first vehicle to start tracking"}
          </p>
          <Button className="mt-4" onClick={() => setShowAddVehicleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      )}
    </div>
  )
}

