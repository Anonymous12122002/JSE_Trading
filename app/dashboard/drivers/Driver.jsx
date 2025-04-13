"use client"

import { useState, useEffect } from "react"
import { useDrivers } from "@/contexts/driver-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Users, Wrench } from "lucide-react"
import { format } from "date-fns"

export default function DriverDebugComponent() {
  const { drivers, loading } = useDrivers()
  const [debugInfo, setDebugInfo] = useState([])

  // Add debug logging
  useEffect(() => {
    const info = [];
    info.push(`Drivers loading state: ${loading}`);
    info.push(`Number of drivers loaded: ${drivers.length}`);
    
    if (drivers.length > 0) {
      // Generate sample of driver data structure
      const sampleDriver = drivers[0];
      info.push(`Sample driver data structure: ${JSON.stringify({
        id: sampleDriver.id.substring(0, 6) + '...',
        fullName: sampleDriver.fullName,
        email: sampleDriver.email,
        status: sampleDriver.status,
        documents: {
          licenseNumber: sampleDriver.documents?.licenseNumber,
          hasLicenseExpiry: !!sampleDriver.documents?.licenseExpiry
        }
      }, null, 2)}`);
    }
    
    // Log info to console
    console.log("Driver Debug Component:", info);
    setDebugInfo(info);
  }, [drivers, loading]);

  if (loading) {
    return <div className="p-8 text-center">Loading driver information...</div>;
  }

  if (drivers.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Drivers Found</AlertTitle>
        <AlertDescription>
          Your account doesn't have any drivers. This may indicate a problem with Firebase data retrieval.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Driver Data Diagnostics
          </CardTitle>
          <CardDescription>
            Displaying information about your drivers to help diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Wrench className="h-4 w-4" />
            <AlertTitle>Debug Information</AlertTitle>
            <AlertDescription>
              <details open>
                <summary className="cursor-pointer font-medium">Driver Data Details</summary>
                <pre className="text-xs mt-2 p-2 bg-slate-100 rounded overflow-auto">
                  {debugInfo.join('\n')}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {drivers.slice(0, 4).map(driver => (
              <Card key={driver.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.profilePhotoUrl} alt={driver.fullName} />
                        <AvatarFallback>{driver.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{driver.fullName}</CardTitle>
                        <CardDescription>{driver.email}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        driver.status === 'active' ? 'default' : 
                        driver.status === 'inactive' ? 'outline' : 
                        'destructive'
                      }
                    >
                      {driver.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-1 text-sm">
                    <dt className="font-medium">Driver ID:</dt>
                    <dd>{driver.driverId}</dd>
                    
                    <dt className="font-medium">Hire Date:</dt>
                    <dd>{format(new Date(driver.hireDate), "MMM d, yyyy")}</dd>
                    
                    <dt className="font-medium">License:</dt>
                    <dd>{driver.documents?.licenseNumber || "N/A"}</dd>
                    
                    <dt className="font-medium">License Expiry:</dt>
                    <dd>{driver.documents?.licenseExpiry ? 
                      format(new Date(driver.documents.licenseExpiry), "MMM d, yyyy") : 
                      "N/A"}</dd>
                      
                    <dt className="font-medium">Documents:</dt>
                    <dd className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {driver.documents ? "Available" : "None"}
                    </dd>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 