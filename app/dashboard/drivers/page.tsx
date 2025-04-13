"use client"

import { useState, useCallback, useRef } from "react"
import { useDrivers, type Driver, type DriverDocument } from "@/contexts/driver-context"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Upload,
  User,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useDropzone } from "react-dropzone"
import Link from "next/link"

type EmploymentType = "full-time" | "contractor"
type DriverStatus = "active" | "inactive" | "suspended"

export default function DriversPage() {
  const { drivers, loading, addDriver, updateDriver, deleteDriver, uploadDriverPhoto, uploadDocument } = useDrivers()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddDriverDialog, setShowAddDriverDialog] = useState(false)
  const [showEditDriverDialog, setShowEditDriverDialog] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [formError, setFormError] = useState("")
  const [newDriver, setNewDriver] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    driverId: "",
    userId: "",
    employmentType: "full-time" as const,
    status: "active" as const,
    documents: {
      id: "",
      licenseNumber: "",
      licenseExpiry: new Date(),
      medicalCertExpiry: new Date(),
      certifications: [],
    } as DriverDocument,
    performance: {
      safetyScore: 100,
      totalTrips: 0,
      totalDistance: 0,
      fuelEfficiency: 0,
      onTimeDeliveryRate: 100,
      idleTime: 0,
      complianceRate: 100,
    },
    hireDate: new Date(),
  })
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter drivers based on search query and status filter
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driverId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (showEditDriverDialog && selectedDriver) {
      setSelectedDriver((prev) => ({ ...prev!, [name]: value }))
    } else {
      setNewDriver((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: EmploymentType | DriverStatus) => {
    if (showEditDriverDialog && selectedDriver) {
      setSelectedDriver((prev) => ({ ...prev!, [name]: value }))
    } else {
      setNewDriver((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotoUpload = async (driverId: string, file: File) => {
    try {
      await uploadDriverPhoto(driverId, file)
      toast({
        title: "Photo Uploaded",
        description: "Driver's profile photo has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload profile photo. Please try again.",
      })
    }
  }

  const handleDocumentUpload = async (driverId: string, docType: string, file: File) => {
    try {
      await uploadDocument(driverId, docType, file)
      toast({
        title: "Document Uploaded",
        description: `${docType} has been uploaded successfully.`,
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
      })
    }
  }

  const handleAddDriver = async () => {
    try {
      setFormError("")
      // Validate required fields
      if (!newDriver.fullName || !newDriver.email || !newDriver.contactNumber || !newDriver.driverId) {
        setFormError("Please fill in all required fields")
        return
      }

      if (!user) {
        setFormError("You must be logged in to add drivers")
        return
      }

      await addDriver({
        ...newDriver,
        userId: user.uid
      })
      setShowAddDriverDialog(false)
      toast({
        title: "Driver Added",
        description: "The driver has been successfully added to your fleet.",
      })
      // Reset form
      setNewDriver({
        fullName: "",
        email: "",
        contactNumber: "",
        driverId: "",
        userId: "",
        employmentType: "full-time",
        status: "active",
        documents: {
          id: "",
          licenseNumber: "",
          licenseExpiry: new Date(),
          medicalCertExpiry: new Date(),
          certifications: [],
        },
        performance: {
          safetyScore: 100,
          totalTrips: 0,
          totalDistance: 0,
          fuelEfficiency: 0,
          onTimeDeliveryRate: 100,
          idleTime: 0,
          complianceRate: 100,
        },
        hireDate: new Date(),
      })
    } catch (error) {
      console.error("Error adding driver:", error)
      setFormError("Failed to add driver. Please try again.")
    }
  }

  const handleEditDriver = async () => {
    if (!selectedDriver) return

    try {
      setFormError("")
      await updateDriver(selectedDriver.id, selectedDriver)
      setShowEditDriverDialog(false)
      toast({
        title: "Driver Updated",
        description: "The driver details have been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating driver:", error)
      setFormError("Failed to update driver. Please try again.")
    }
  }

  const handleDeleteDriver = async (id: string) => {
    try {
      await deleteDriver(id)
      toast({
        title: "Driver Deleted",
        description: "The driver has been removed from your fleet.",
      })
    } catch (error) {
      console.error("Error deleting driver:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete driver. Please try again.",
      })
    }
  }

  const onDocumentDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedDriver || !documentType || acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploadingDocument(true)
      setFormError("")

      try {
        await handleDocumentUpload(selectedDriver.id, documentType, file)
        setShowDocumentDialog(false)
        toast({
          title: "Document Uploaded",
          description: "The document has been successfully uploaded.",
        })
      } catch (error) {
        console.error("Error uploading document:", error)
        setFormError("Failed to upload document. Please try again.")
      } finally {
        setUploadingDocument(false)
      }
    },
    [selectedDriver, documentType, handleDocumentUpload, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDocumentDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    disabled: uploadingDocument || !documentType,
    noClick: true,
  })

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
          <p className="text-muted-foreground">Manage your fleet drivers and documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/drivers/debug" className="text-muted-foreground hover:underline text-sm flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Debug Driver Data
          </Link>
          <Dialog open={showAddDriverDialog} onOpenChange={setShowAddDriverDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Enter the details of the driver you want to add to your fleet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={newDriver.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <Input
                      id="driverId"
                      name="driverId"
                      value={newDriver.driverId}
                      onChange={handleInputChange}
                      placeholder="DRV001"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newDriver.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={newDriver.contactNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      name="employmentType"
                      value={newDriver.employmentType}
                      onValueChange={(value: EmploymentType) => handleSelectChange("employmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={newDriver.status}
                      onValueChange={(value: DriverStatus) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={newDriver.documents.licenseNumber}
                      onChange={(e) =>
                        setNewDriver((prev) => ({
                          ...prev,
                          documents: { ...prev.documents, licenseNumber: e.target.value },
                        }))
                      }
                      placeholder="DL12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                    <Input
                      id="licenseExpiry"
                      name="licenseExpiry"
                      type="date"
                      value={format(newDriver.documents.licenseExpiry, "yyyy-MM-dd")}
                      onChange={(e) =>
                        setNewDriver((prev) => ({
                          ...prev,
                          documents: { ...prev.documents, licenseExpiry: new Date(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setShowAddDriverDialog(false)}
                  className={cn("bg-secondary text-secondary-foreground hover:bg-secondary/80")}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddDriver}>Add Driver</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 md:w-[300px]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="space-y-0 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{driver.fullName}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className={cn("hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0")}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDriver(driver)
                            setShowEditDriverDialog(true)
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowDocumentDialog(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteDriver(driver.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{driver.driverId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{driver.email}</span>
                      </div>
                      <Badge
                        className={
                          driver.status === "active"
                            ? "bg-green-500"
                            : driver.status === "suspended"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }
                      >
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Hired: {format(driver.hireDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        License expires: {format(driver.documents.licenseExpiry, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <span className="text-sm font-medium">Documents</span>
                    <div className="grid gap-2">
                      {Object.entries(driver.documents)
                        .filter(([key]) => key.endsWith('Url'))
                        .map(([key, url]) => (
                          <a
                            key={key}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            <FileText className="h-4 w-4" />
                            {key.replace('Url', '').split(/(?=[A-Z])/).join(' ')}
                          </a>
                        ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="grid w-full gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Total Trips</span>
                      </span>
                      <span>{driver.performance.totalTrips}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Safety Score</span>
                      </span>
                      <span>{driver.performance.safetyScore}%</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{driver.fullName}</CardTitle>
                      <CardDescription>{driver.driverId}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          driver.status === "active"
                            ? "bg-green-500"
                            : driver.status === "suspended"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }
                      >
                        {driver.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className={cn("hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0")}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDriver(driver)
                              setShowEditDriverDialog(true)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowDocumentDialog(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Documents
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Contact Info</span>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{driver.email}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{driver.contactNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Employment</span>
                    <div className="text-sm text-muted-foreground">{driver.employmentType}</div>
                    <div className="text-sm text-muted-foreground">
                      Hired: {format(driver.hireDate, "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">License</span>
                    <div className="text-sm text-muted-foreground">{driver.documents.licenseNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      Expires: {format(driver.documents.licenseExpiry, "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Performance</span>
                    <div className="text-sm text-muted-foreground">
                      Safety Score: {driver.performance.safetyScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Trips: {driver.performance.totalTrips}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Documents</span>
                    <div className="grid gap-1">
                      {Object.entries(driver.documents)
                        .filter(([key]) => key.endsWith('Url'))
                        .map(([key, url]) => (
                          <a
                            key={key}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            <FileText className="h-4 w-4" />
                            {key.replace('Url', '').split(/(?=[A-Z])/).join(' ')}
                          </a>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDriverDialog} onOpenChange={setShowEditDriverDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update the details of your driver.</DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid gap-6 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={selectedDriver.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverId">Driver ID</Label>
                  <Input
                    id="driverId"
                    name="driverId"
                    value={selectedDriver.driverId}
                    onChange={handleInputChange}
                    placeholder="DRV001"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={selectedDriver.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={selectedDriver.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    name="employmentType"
                    value={selectedDriver.employmentType}
                    onValueChange={(value: EmploymentType) => handleSelectChange("employmentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={selectedDriver.status}
                    onValueChange={(value: DriverStatus) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={selectedDriver.documents.licenseNumber}
                    onChange={(e) =>
                      setSelectedDriver((prev) => ({
                        ...prev!,
                        documents: { ...prev!.documents, licenseNumber: e.target.value },
                      }))
                    }
                    placeholder="DL12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    name="licenseExpiry"
                    type="date"
                    value={format(selectedDriver.documents.licenseExpiry, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setSelectedDriver((prev) => ({
                        ...prev!,
                        documents: { ...prev!.documents, licenseExpiry: new Date(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setShowEditDriverDialog(false)}
              className={cn("bg-secondary text-secondary-foreground hover:bg-secondary/80")}
            >
              Cancel
            </Button>
            <Button onClick={handleEditDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for {selectedDriver?.fullName}. Supported formats: PDF, JPEG, PNG.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="license">Driver's License</SelectItem>
                  <SelectItem value="medicalCert">Medical Certificate</SelectItem>
                  <SelectItem value="trainingCert">Training Certificate</SelectItem>
                  <SelectItem value="insurance">Insurance Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
              )}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              {uploadingDocument ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {isDragActive ? "Drop the file here" : "Drag and drop a file, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG, max 5MB</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between space-x-2">
            <button
              className={buttonVariants({ variant: "secondary" })}
              onClick={() => setShowDocumentDialog(false)}
              disabled={uploadingDocument}
            >
              Cancel
            </button>
            <button
              className={buttonVariants({ variant: "default" })}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingDocument || !documentType}
            >
              Select File
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 