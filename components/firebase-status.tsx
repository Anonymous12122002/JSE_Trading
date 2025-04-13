"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, AlertCircle, CheckCircle2, Wrench } from "lucide-react"
import { Button } from "./ui/button"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Badge } from "./ui/badge"
import { runFirebaseDiagnostics, testStorage } from "@/lib/firebase-utils"

export function FirebaseStatus() {
  const { user } = useAuth()
  const [checking, setChecking] = useState(false)
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "unauthenticated" | "error">("checking")
  const [storageStatus, setStorageStatus] = useState<"unchecked" | "checking" | "accessible" | "error">("unchecked")
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [storageHelp, setStorageHelp] = useState<string | null>(null)
  const [showFixInstructions, setShowFixInstructions] = useState(false)

  useEffect(() => {
    // Check authentication status
    if (user) {
      setAuthStatus("authenticated")
    } else {
      setAuthStatus("unauthenticated")
    }
  }, [user])

  const runDiagnostics = async () => {
    if (!user) {
      setErrorMessage("You must be logged in to test Firebase")
      return
    }

    setChecking(true)
    setStorageStatus("checking")
    setErrorMessage(null)
    setStorageHelp(null)

    try {
      const results = await runFirebaseDiagnostics()
      setDiagnosticResults(results)
      
      // Update status based on results
      if (results.storage.status === 'success') {
        setStorageStatus("accessible")
      } else {
        setStorageStatus("error")
        setErrorMessage(results.storage.error || "Unknown storage error")
        setStorageHelp(results.storageError || null)
        setShowFixInstructions(true)
      }
    } catch (error) {
      console.error("Diagnostics failed:", error)
      setStorageStatus("error")
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Unknown error running diagnostics")
      }
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Firebase Connection Status</span>
          {checking && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Authentication:</span>
              <div className="flex items-center">
                {authStatus === "checking" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {authStatus === "authenticated" && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                {authStatus === "unauthenticated" && <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />}
                {authStatus === "error" && <AlertCircle className="h-4 w-4 mr-2 text-red-500" />}
                
                <Badge className={
                  authStatus === "authenticated" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                  authStatus === "unauthenticated" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                  authStatus === "error" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""
                }>
                  {authStatus === "checking" && "Checking..."}
                  {authStatus === "authenticated" && "Authenticated"}
                  {authStatus === "unauthenticated" && "Not authenticated"}
                  {authStatus === "error" && "Error"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Storage Access:</span>
              <div className="flex items-center">
                {storageStatus === "checking" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {storageStatus === "accessible" && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                {storageStatus === "error" && <AlertCircle className="h-4 w-4 mr-2 text-red-500" />}
                {storageStatus === "unchecked" && <span className="h-4 w-4 mr-2" />}
                
                <Badge className={
                  storageStatus === "accessible" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                  storageStatus === "error" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                  "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }>
                  {storageStatus === "checking" && "Checking..."}
                  {storageStatus === "accessible" && "Accessible"}
                  {storageStatus === "error" && "Error"}
                  {storageStatus === "unchecked" && "Not checked"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid place-items-center">
            <Button 
              onClick={runDiagnostics} 
              disabled={checking || authStatus !== "authenticated"}
              variant="outline"
              className="w-full"
            >
              {checking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Run Firebase Diagnostics
            </Button>
          </div>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firebase Error</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {storageHelp && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Wrench className="h-4 w-4" />
            <AlertTitle>Troubleshooting</AlertTitle>
            <AlertDescription>
              {storageHelp}
            </AlertDescription>
          </Alert>
        )}
        
        {showFixInstructions && (
          <Accordion type="single" collapsible>
            <AccordionItem value="fix-instructions">
              <AccordionTrigger>How to fix Firebase Storage issues</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">For the "retry-limit-exceeded" error:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Check your internet connection and try a different network if possible.</li>
                    <li>Log out and log back in to refresh your authentication token.</li>
                    <li>Update your Firebase Storage rules in the Firebase Console:</li>
                  </ol>
                  
                  <div className="bg-slate-800 text-slate-100 p-3 rounded-md my-2 font-mono text-xs">
                    <pre>
                      {`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                    </pre>
                  </div>
                  
                  <p className="mt-2">
                    Until the Firebase issues are resolved, you can continue using the local document storage feature, 
                    which will store documents temporarily in your browser.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {user && (
          <div className="text-xs text-muted-foreground">
            <p>Logged in as: {user.email}</p>
            <p>User ID: {user.uid.substring(0, 6)}...{user.uid.substring(user.uid.length - 4)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 