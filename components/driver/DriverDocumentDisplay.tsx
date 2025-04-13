"use client"

import { useState, useEffect } from "react"
import { useDocuments, type Document, type DocumentType } from "@/contexts/document-context"
import { useDrivers, type Driver } from "@/contexts/driver-context"
import { FileText, Download, Calendar, AlertTriangle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DriverDocumentDisplay() {
  const { documents, loading: docsLoading, bulkDownload } = useDocuments()
  const { drivers, loading: driversLoading } = useDrivers()
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  // Add debug logging
  useEffect(() => {
    const info = [];
    info.push(`Documents loaded: ${documents.length}`);
    info.push(`Drivers loaded: ${drivers.length}`);
    
    if (documents.length > 0) {
      info.push(`Document types: ${Array.from(new Set(documents.map(d => d.type))).join(', ')}`);
      info.push(`Documents with driver entityType: ${documents.filter(d => d.entityType === 'driver').length}`);
    }
    
    if (drivers.length > 0) {
      info.push(`Driver IDs: ${drivers.map(d => d.id.substring(0, 6) + '...').join(', ')}`);
    }
    
    info.push(`Drivers loading: ${driversLoading}`);
    info.push(`Documents loading: ${docsLoading}`);
    
    console.log('DriverDocumentDisplay Debug:', info);
    setDebugInfo(info);
  }, [documents, drivers, driversLoading, docsLoading]);
  
  // Filter documents to only show driver documents
  const driverDocuments = documents.filter(doc => 
    doc.entityType === "driver" && 
    (!selectedDriverId || doc.entityId === selectedDriverId)
  );
  
  // Get all unique drivers who have documents
  const driverIds = [...new Set(driverDocuments.map(doc => doc.entityId).filter(Boolean))];
  
  // Get driver details for each document
  const getDriver = (driverId?: string) => {
    if (!driverId) return null;
    return drivers.find(d => d.id === driverId) || null;
  };
  
  if (docsLoading || driversLoading) {
    return <div className="p-4 text-center">Loading driver documents...</div>;
  }
  
  if (driverDocuments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-8 text-center border border-dashed rounded-lg">
          <FileText className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No driver documents found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload driver documents to see them here
          </p>
        </div>
        
        {/* Show debug information in development mode */}
        {process.env.NODE_ENV !== 'production' && debugInfo.length > 0 && (
          <Alert>
            <AlertDescription>
              <details>
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <ul className="text-xs mt-2 space-y-1">
                  {debugInfo.map((info, i) => (
                    <li key={i}>{info}</li>
                  ))}
                </ul>
              </details>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant={selectedDriverId === null ? "default" : "outline"}
          onClick={() => setSelectedDriverId(null)}
        >
          All Drivers
        </Button>
        
        {driverIds.map(driverId => {
          const driver = getDriver(driverId);
          return (
            <Button
              key={driverId}
              variant={selectedDriverId === driverId ? "default" : "outline"}
              onClick={() => setSelectedDriverId(driverId || null)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={driver?.profilePhotoUrl} alt={driver?.fullName || "Driver"} />
                <AvatarFallback>{driver?.fullName?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
              <span>{driver?.fullName || `Driver #${driverId}`}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Show debug information in development mode */}
      {process.env.NODE_ENV !== 'production' && debugInfo.length > 0 && (
        <Alert>
          <AlertDescription>
            <details>
              <summary className="cursor-pointer font-medium">Debug Information</summary>
              <ul className="text-xs mt-2 space-y-1">
                {debugInfo.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </details>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {driverDocuments.map(doc => {
          const driver = getDriver(doc.entityId);
          const isExpired = doc.expiryDate ? new Date(doc.expiryDate) < new Date() : false;
          
          return (
            <Card key={doc.id} className={cn(
              isExpired && "border-red-200"
            )}>
              <CardHeader className={cn(
                "pb-2",
                isExpired && "bg-red-50"
              )}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                    </CardDescription>
                  </div>
                  
                  {isExpired && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Expired
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {driver && (
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={driver.profilePhotoUrl} alt={driver.fullName} />
                        <AvatarFallback>{driver.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{driver.fullName}</div>
                        <div className="text-xs text-muted-foreground">ID: {driver.driverId}</div>
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
                      <span className="text-sm font-medium">Expiry:</span>
                      <span className={cn(
                        "text-sm",
                        isExpired ? "text-red-600 font-medium" : "text-muted-foreground"
                      )}>
                        {format(new Date(doc.expiryDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">File Size:</span>
                    <span className="text-sm text-muted-foreground">
                      {(doc.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => window.open(doc.url, "_blank")}>
                  <FileText className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => bulkDownload([doc.id])}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={`/dashboard/drivers?id=${doc.entityId}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 