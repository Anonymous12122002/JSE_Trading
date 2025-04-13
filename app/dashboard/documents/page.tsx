"use client"

import { useState, useEffect } from "react"
import { useDocuments, type Document, type DocumentType } from "@/contexts/document-context"
import { useDrivers, type Driver } from "@/contexts/driver-context"
import {
  AlertTriangle,
  Calendar,
  Download,
  FileText,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Car,
  User,
  Route,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { useDropzone } from "react-dropzone"
import { DriverDocumentDisplay } from "@/components/driver/DriverDocumentDisplay"
import { useLocalDocuments } from "@/lib/localUploadService"
import { LocalDocumentDisplay } from "@/components/LocalDocumentDisplay"
import Link from "next/link"

const documentTypes: Record<DocumentType, { label: string; category: string }> = {
  driverLicense: { label: "Driver's License", category: "driver" },
  trainingCertificate: { label: "Training Certificate", category: "driver" },
  medicalReport: { label: "Medical Report", category: "driver" },
  vehicleRegistration: { label: "Registration Certificate", category: "vehicle" },
  insurancePolicy: { label: "Insurance Policy", category: "vehicle" },
  pucCertificate: { label: "PUC Certificate", category: "vehicle" },
  deliveryReceipt: { label: "Delivery Receipt", category: "trip" },
  tollInvoice: { label: "Toll Invoice", category: "trip" },
}

export default function DocumentsPage() {
  const { documents, loading, uploadDocument, deleteDocument, bulkUpload, bulkDownload } = useDocuments()
  const { drivers } = useDrivers()
  const { uploadDocument: uploadLocalDocument } = useLocalDocuments()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<DocumentType | "all">("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadType, setUploadType] = useState<DocumentType | "">("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "retrying" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = async (acceptedFiles: File[]) => {
    if (!uploadType) {
      console.log("Upload type not selected");
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please select a document type before uploading.",
      });
      return;
    }

    console.log("Starting upload process with type:", uploadType);
    console.log("Files to upload:", acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    setUploadStatus("uploading");
    setUploadProgress(10);
    
    try {
      if (acceptedFiles.length > 1) {
        console.log("Attempting bulk upload of", acceptedFiles.length, "files");
        setUploadProgress(20);
        await bulkUpload(acceptedFiles, uploadType)
        setUploadProgress(100);
        setUploadStatus("success");
        toast({
          title: "Documents Uploaded",
          description: `Successfully uploaded ${acceptedFiles.length} documents.`,
        })
      } else {
        console.log("Attempting single file upload with expiry date:", expiryDate || "not set");
        const metadata = {
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        };
        console.log("Upload metadata:", metadata);
        setUploadProgress(30);
        
        try {
          // First attempt
          await uploadDocument(acceptedFiles[0], uploadType, metadata);
          setUploadProgress(100);
          setUploadStatus("success");
        } catch (initialError) {
          // If first attempt failed, show retrying message
          console.log("Initial upload attempt failed, retrying with alternate method...");
          setUploadStatus("retrying");
          setUploadProgress(50);
          
          try {
            // If uploading to Firebase fails completely, use local storage as last resort
            console.log("All Firebase attempts failed, storing document locally");
            setUploadProgress(80);
            await uploadLocalDocument(acceptedFiles[0], uploadType);
            setUploadProgress(100);
            setUploadStatus("success");
            
            toast({
              title: "Document Saved Locally",
              description: "Firebase upload failed, but document was saved to local storage for now. You'll need to retry the upload when Firebase is available.",
              variant: "destructive",
            });
            
            setShowUploadDialog(false);
            return;
          } catch (localError) {
            console.error("Even local storage failed:", localError);
            throw localError;
          }
        }
        
        toast({
          title: "Document Uploaded",
          description: "The document has been uploaded successfully.",
        })
      }
      setShowUploadDialog(false)
    } catch (error) {
      setUploadStatus("error");
      console.error("Upload error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Error: ${error.message}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Failed to upload document(s). Please try again.",
        });
      }
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
      }, 3000);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
      })
    }
  }

  const handleBulkDownload = async () => {
    try {
      await bulkDownload(selectedDocuments)
      toast({
        title: "Documents Downloaded",
        description: `Successfully downloaded ${selectedDocuments.length} documents.`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download documents. Please try again.",
      })
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      documentTypes[doc.type].label.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || doc.type === selectedType

    return matchesSearch && matchesType
  })

  const documentsByCategory = {
    driver: filteredDocuments.filter((doc) => documentTypes[doc.type].category === "driver"),
    vehicle: filteredDocuments.filter((doc) => documentTypes[doc.type].category === "vehicle"),
    trip: filteredDocuments.filter((doc) => documentTypes[doc.type].category === "trip"),
  }

  // Get entity details for each document
  const getEntityName = (doc: Document) => {
    if (!doc.entityId) return "Unassigned";
    
    if (doc.entityType === "driver") {
      const driver = drivers.find(d => d.id === doc.entityId);
      return driver ? driver.fullName : `Driver #${doc.entityId}`;
    } else if (doc.entityType === "vehicle") {
      // Would fetch from vehicle context
      return `Vehicle #${doc.entityId}`;
    } else if (doc.entityType === "trip") {
      // Would fetch from trip context
      return `Trip #${doc.entityId}`;
    }
    
    // Default case for unknown entity type
    return `Unknown Entity #${doc.entityId}`;
  }

  // Get entity navigation link
  const getEntityLink = (doc: Document) => {
    if (!doc.entityId) return null;
    
    if (doc.entityType === "driver") {
      return `/dashboard/drivers?id=${doc.entityId}`;
    } else if (doc.entityType === "vehicle") {
      return `/dashboard/vehicles?id=${doc.entityId}`;
    } else if (doc.entityType === "trip") {
      return `/dashboard/trips?id=${doc.entityId}`;
    }
    
    return null;
  }

  // Add useEffect to load troubleshooter script
  useEffect(() => {
    // Import troubleshooter script
    const script = document.createElement('script');
    script.src = '/js/troubleshoot.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage documents for drivers, vehicles, and trips
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/dashboard/documents/troubleshoot">
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Troubleshoot
            </Button>
          </Link>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Document Type</Label>
                  <Select 
                    value={uploadType} 
                    onValueChange={(value: DocumentType) => setUploadType(value)}
                    disabled={uploadStatus === "uploading" || uploadStatus === "retrying"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentTypes).map(([type, { label, category }]) => (
                        <SelectItem key={type} value={type}>
                          {label} ({category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Expiry Date (if applicable)</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={uploadStatus === "uploading" || uploadStatus === "retrying"}
                  />
                </div>
                
                {uploadStatus === "idle" && (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      {isDragActive ? (
                        <p>Drop the files here...</p>
                      ) : (
                        <p>Drag & drop files here, or click to select files</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, PNG, JPG (max 5MB)
                      </p>
                    </div>
                  </div>
                )}
                
                {(uploadStatus === "uploading" || uploadStatus === "retrying") && (
                  <div className="border-2 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <div>
                        <p className="font-medium">
                          {uploadStatus === "uploading" ? "Uploading document..." : "Retrying upload..."}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {uploadStatus === "uploading" 
                            ? "Please wait while we upload your document" 
                            : "First attempt failed, trying alternative method..."}
                        </p>
                      </div>
                      <div className="w-full mt-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300 ease-in-out" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {uploadStatus === "success" && (
                  <div className="border-2 border-green-100 rounded-lg p-8 text-center bg-green-50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                      <p className="font-medium text-green-600">Upload Successful!</p>
                      <p className="text-sm text-green-600">Your document has been uploaded successfully.</p>
                    </div>
                  </div>
                )}
                
                {uploadStatus === "error" && (
                  <div className="border-2 border-red-100 rounded-lg p-8 text-center bg-red-50">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                      <p className="font-medium text-red-600">Upload Failed</p>
                      <p className="text-sm text-red-600">There was an error uploading your document. Please try again.</p>
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        onClick={() => setUploadStatus("idle")}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
                
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            disabled={selectedDocuments.length === 0}
            onClick={handleBulkDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download ({selectedDocuments.length})
          </Button>
        </div>
      </div>

      <LocalDocumentDisplay />
      
      {documents.length === 0 && !loading && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No documents found. Please try uploading a new document to get started.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={(value: DocumentType | "all") => setSelectedType(value)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(documentTypes).map(([type, { label }]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="driver" className="flex-1">
        <TabsList>
          <TabsTrigger value="driver" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Driver Documents
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Vehicle Documents
          </TabsTrigger>
          <TabsTrigger value="trip" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Trip Documents
          </TabsTrigger>
        </TabsList>

        {(["driver", "vehicle", "trip"] as const).map((category) => (
          <TabsContent key={category} value={category}>
            {category === "driver" ? (
              <DriverDocumentDisplay />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {documentsByCategory[category].map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {documentTypes[doc.type].label}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(doc.url, "_blank")}>
                              <FileText className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedDocuments((prev) => [...prev, doc.id])}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{doc.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {doc.entityId && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Belongs to:</span>
                            <div>
                              {getEntityLink(doc) ? (
                                <a href={getEntityLink(doc) || "#"} className="hover:underline">
                                  <Badge variant="outline" className="cursor-pointer">
                                    {getEntityName(doc)}
                                  </Badge>
                                </a>
                              ) : (
                                <Badge variant="outline">{getEntityName(doc)}</Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Uploaded:</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        {doc.expiryDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Expires:</span>
                            <span className={`text-sm ${new Date(doc.expiryDate) < new Date() ? "text-red-500" : "text-muted-foreground"}`}>
                              {format(new Date(doc.expiryDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge 
                            variant={doc.status === "active" ? "default" : doc.status === "expired" ? "destructive" : "outline"}
                          >
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => window.open(doc.url, "_blank")}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Document
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {documentsByCategory[category].length === 0 && (
                  <div className="col-span-full flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <h3 className="font-semibold">No documents found</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload {category} documents to see them here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 