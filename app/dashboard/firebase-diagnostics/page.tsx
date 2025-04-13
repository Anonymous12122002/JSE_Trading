"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { runFirebaseDiagnostics } from "@/lib/firebase-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle2, FileText, InfoIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FirebaseDiagnosticsPage() {
  const { user } = useAuth()
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Run diagnostics on page load
  useEffect(() => {
    if (user) {
      runTests()
    }
  }, [user])
  
  const runTests = async () => {
    if (!user) {
      setError("You must be logged in to run diagnostics")
      return
    }
    
    setChecking(true)
    setError(null)
    
    try {
      const diagnosticResults = await runFirebaseDiagnostics()
      setResults(diagnosticResults)
    } catch (error) {
      console.error("Diagnostics failed:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setChecking(false)
    }
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Firebase Diagnostics</h1>
          <p className="text-muted-foreground">
            Troubleshoot issues with Firebase authentication, storage, and database
          </p>
        </div>
        <Link href="/dashboard/documents">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Button>
        </Link>
      </div>
      
      {!user ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to run Firebase diagnostics
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Diagnostic Results</h2>
              {results && (
                <p className="text-sm text-muted-foreground">
                  Last run: {new Date(results.timestamp).toLocaleString()}
                </p>
              )}
            </div>
            <Button onClick={runTests} disabled={checking}>
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Diagnostics"
              )}
            </Button>
          </div>
          
          {checking && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="font-medium">Running Firebase Diagnostics...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Running Diagnostics</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {results && (
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="firestore">Firestore</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnostic Summary</CardTitle>
                    <CardDescription>
                      Overall health of your Firebase services
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <StatusCard 
                        title="Authentication"
                        status={results.auth.status === 'success' && results.auth.authenticated ? 'success' : 'error'}
                        message={results.auth.authenticated ? 'Authenticated' : 'Not authenticated'}
                      />
                      
                      <StatusCard 
                        title="Storage"
                        status={results.storage.status}
                        message={results.storage.status === 'success' ? 'Accessible' : 'Error'}
                      />
                      
                      <StatusCard 
                        title="Firestore"
                        status={results.firestore.status}
                        message={results.firestore.status === 'success' ? 'Accessible' : 'Error'}
                      />
                    </div>
                    
                    {(results.storage.status === 'error' || results.firestore.status === 'error') && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Issues Detected</AlertTitle>
                        <AlertDescription>
                          Some Firebase services are not working correctly. See the relevant tabs for more details.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {results.storageError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Storage Issue Detected</AlertTitle>
                        <AlertDescription>{results.storageError}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Browser: {results.browser}
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="auth">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                    <CardDescription>
                      Details about your current authentication state
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge className={results.auth.authenticated ? 
                          "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {results.auth.authenticated ? "Authenticated" : "Not Authenticated"}
                        </Badge>
                      </div>
                      
                      {results.auth.authenticated && (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">User ID:</span>
                            <span className="font-mono text-sm">{results.auth.userId}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{results.auth.email}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!results.auth.authenticated && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Authenticated</AlertTitle>
                        <AlertDescription>
                          You need to be logged in to use Firebase services. Try logging out and back in.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="storage">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Status</CardTitle>
                    <CardDescription>
                      Firebase Storage connectivity and permissions
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge className={results.storage.status === 'success' ? 
                          "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {results.storage.status === 'success' ? "Accessible" : "Error"}
                        </Badge>
                      </div>
                      
                      {results.storage.status === 'success' && (
                        <div className="flex justify-between">
                          <span className="font-medium">Test Location:</span>
                          <span className="font-mono text-xs truncate max-w-[200px]">{results.storage.storageRef}</span>
                        </div>
                      )}
                      
                      {results.storage.status === 'error' && (
                        <div className="flex justify-between">
                          <span className="font-medium">Error:</span>
                          <span className="text-red-600">{results.storage.error}</span>
                        </div>
                      )}
                    </div>
                    
                    {results.storage.status === 'error' && (
                      <>
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Storage Error</AlertTitle>
                          <AlertDescription>{results.storage.error}</AlertDescription>
                        </Alert>
                        
                        {results.storageError && (
                          <Alert className="bg-amber-50 border-amber-200">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Troubleshooting</AlertTitle>
                            <AlertDescription>{results.storageError}</AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="space-y-2 border-t pt-4">
                          <h3 className="font-medium">Recommended Firebase Storage Rules:</h3>
                          <pre className="bg-slate-800 text-slate-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                          </pre>
                          <p className="text-sm text-muted-foreground">
                            These rules allow any authenticated user to read and write files.
                            For production, you should use more restrictive rules.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="firestore">
                <Card>
                  <CardHeader>
                    <CardTitle>Firestore Status</CardTitle>
                    <CardDescription>
                      Firebase Firestore database connectivity and permissions
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge className={results.firestore.status === 'success' ? 
                          "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {results.firestore.status === 'success' ? "Accessible" : "Error"}
                        </Badge>
                      </div>
                      
                      {results.firestore.status === 'success' && (
                        <div className="flex justify-between">
                          <span className="font-medium">Documents Found:</span>
                          <span>{results.firestore.empty ? "No" : "Yes"}</span>
                        </div>
                      )}
                      
                      {results.firestore.status === 'error' && (
                        <div className="flex justify-between">
                          <span className="font-medium">Error:</span>
                          <span className="text-red-600">{results.firestore.error}</span>
                        </div>
                      )}
                    </div>
                    
                    {results.firestore.status === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Firestore Error</AlertTitle>
                        <AlertDescription>{results.firestore.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents Locally</CardTitle>
              <CardDescription>
                If Firebase Storage is not working, you can use browser local storage for your documents
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm">
                The application now includes a local document storage feature that allows you to store
                documents directly in your browser when Firebase Storage is unavailable. These documents
                will be available until you clear your browser data.
              </p>
            </CardContent>
            
            <CardFooter>
              <Link href="/dashboard/documents">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Go to Documents
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

function StatusCard({ title, status, message }: { title: string, status: string, message: string }) {
  return (
    <div className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
      status === 'success' ? 'bg-green-50 border-green-200' : 
      status === 'error' ? 'bg-red-50 border-red-200' : 
      'bg-slate-50 border-slate-200'
    }`}>
      <div className="rounded-full p-2 bg-white">
        {status === 'success' ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <AlertCircle className="h-6 w-6 text-red-500" />
        )}
      </div>
      <h3 className="font-medium">{title}</h3>
      <Badge className={
        status === 'success' ? "bg-green-100 text-green-800" : 
        status === 'error' ? "bg-red-100 text-red-800" : 
        "bg-slate-100 text-slate-800"
      }>
        {message}
      </Badge>
    </div>
  )
} 