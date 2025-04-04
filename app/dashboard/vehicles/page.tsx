"use client"

import type React from "react"
import { useState } from "react"
import { useVehicles, type Vehicle } from "@/contexts/vehicle-context"
import { useAuth } from "@/contexts/auth-context"
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
  Loader2,
  AlertCircle,
  CheckCircle2,
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buttonVariants } from "@/components/ui/button"

export default function VehiclesPage() {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false)
  const [showEditVehicleDialog, setShowEditVehicleDialog] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formError, setFormError] = useState("")
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    type: "",
    status: "idle" as const,
  })

  // Filter vehicles based on search query and status filter
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.driver?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (showEditVehicleDialog && selectedVehicle) {
      setSelectedVehicle((prev) => ({ ...prev!, [name]: value }))
    } else {
      setNewVehicle((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string | "active" | "idle" | "maintenance") => {
    if (showEditVehicleDialog && selectedVehicle) {
      setSelectedVehicle((prev) => ({ ...prev!, [name]: value }))
    } else {
      setNewVehicle((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddVehicle = async () => {
    try {
      setFormError("")
      // Validate required fields
      if (!newVehicle.name || !newVehicle.registrationNumber || !newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.type) {
        setFormError("Please fill in all required fields")
        return
      }

      if (!user) {
        setFormError("You must be logged in to add vehicles")
        return
      }

      await addVehicle({
        ...newVehicle,
        userId: user.uid
      })
      setShowAddVehicleDialog(false)
      toast({
        title: "Vehicle Added",
        description: "The vehicle has been successfully added to your fleet.",
      })
      // Reset form
      setNewVehicle({
        name: "",
        registrationNumber: "",
        make: "",
        model: "",
        year: "",
        type: "",
        status: "idle",
      })
    } catch (error) {
      console.error("Error adding vehicle:", error)
      setFormError("Failed to add vehicle. Please try again.")
    }
  }

  const handleEditVehicle = async () => {
    if (!selectedVehicle) return

    try {
      setFormError("")
      await updateVehicle(selectedVehicle.id, selectedVehicle)
      setShowEditVehicleDialog(false)
      toast({
        title: "Vehicle Updated",
        description: "The vehicle details have been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating vehicle:", error)
      setFormError("Failed to update vehicle. Please try again.")
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id)
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been removed from your fleet.",
      })
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
      })
    }
  }

  const vehicleForm = (
    <div className="grid gap-4 py-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vehicle Name</Label>
          <Input
            id="name"
            name="name"
            value={showEditVehicleDialog ? selectedVehicle?.name : newVehicle.name}
            onChange={handleInputChange}
            placeholder="e.g., Delivery Truck 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={showEditVehicleDialog ? selectedVehicle?.registrationNumber : newVehicle.registrationNumber}
            onChange={handleInputChange}
            placeholder="e.g., ABC 123 GP"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            value={showEditVehicleDialog ? selectedVehicle?.make : newVehicle.make}
            onChange={handleInputChange}
            placeholder="e.g., Toyota"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={showEditVehicleDialog ? selectedVehicle?.model : newVehicle.model}
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
            value={showEditVehicleDialog ? selectedVehicle?.year : newVehicle.year}
            onChange={handleInputChange}
            placeholder="e.g., 2023"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            name="type"
            value={showEditVehicleDialog ? selectedVehicle?.type : newVehicle.type}
            onChange={handleInputChange}
            placeholder="e.g., Truck"
          />
        </div>
      </div>

      {showEditVehicleDialog && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={selectedVehicle?.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Vehicles</h2>
          <p className="text-sm text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Add a new vehicle to your fleet</DialogDescription>
            </DialogHeader>
            {vehicleForm}
            <DialogFooter>
              <Button className="w-full" onClick={handleAddVehicle}>
                Add Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="flex-1">
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {vehicle.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className={cn("h-8 w-8 p-0", buttonVariants({ variant: "ghost" }))}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVehicle(vehicle)
                            setShowEditVehicleDialog(true)
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{vehicle.registrationNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={cn(
                        "capitalize",
                        vehicle.status === "active" && "bg-green-500",
                        vehicle.status === "idle" && "bg-yellow-500",
                        vehicle.status === "maintenance" && "bg-red-500"
                      )}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    {vehicle.driver && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Driver</span>
                        <span className="text-sm font-medium">{vehicle.driver}</span>
                      </div>
                    )}
                    {vehicle.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm font-medium">{vehicle.location}</span>
                      </div>
                    )}
                    {vehicle.fuelLevel !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fuel Level</span>
                          <span className="font-medium">{vehicle.fuelLevel}%</span>
                        </div>
                        <Progress value={vehicle.fuelLevel} />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Last updated {vehicle.updatedAt.toLocaleDateString()}
                  </div>
                  <Button className={cn("h-8 w-8 p-0", buttonVariants({ variant: "ghost" }))}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {vehicle.name}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.registrationNumber}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "capitalize",
                        vehicle.status === "active" && "bg-green-500",
                        vehicle.status === "idle" && "bg-yellow-500",
                        vehicle.status === "maintenance" && "bg-red-500"
                      )}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.driver || "-"}</TableCell>
                    <TableCell>{vehicle.location || "-"}</TableCell>
                    <TableCell>{vehicle.updatedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className={cn("h-8 w-8 p-0", buttonVariants({ variant: "ghost" }))}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicle(vehicle)
                              setShowEditVehicleDialog(true)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteVehicle(vehicle.id)} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditVehicleDialog} onOpenChange={setShowEditVehicleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle details</DialogDescription>
          </DialogHeader>
          {vehicleForm}
          <DialogFooter>
            <Button className="w-full" onClick={handleEditVehicle}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

