"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useDocuments } from "@/contexts/document-context"
import { useLocalDocuments } from "@/lib/localUploadService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LocalDocumentDisplay } from "@/components/LocalDocumentDisplay"
import { Check, AlertTriangle, RefreshCw, Database, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export default function TroubleshootPage() {
  const { user } = useAuth()
  const { documents } = useDocuments()
  const { documents: localDocuments } = useLocalDocuments()
  const [testResult, setTestResult] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message?: string
  }>({ status: "idle" })
  
  const testStorageAccess = async () => {
    setTestResult({ status: "testing" })
    
    try {
      if (!user) {
        setTestResult({ 
          status: "error", 
          message: "You need to be logged in to test storage access" 
        })
        return
      }
      
      // Create test file
      const testBlob = new Blob(['test-content'], { type: 'text/plain' })
      const testFileName = `test-${Date.now()}.txt`
      const testRef = ref(storage, `test/${user.uid}/${testFileName}`)
      
      // Upload
      await uploadBytes(testRef, testBlob)
      const url = await getDownloadURL(testRef)
      
      // Clean up
      await deleteObject(testRef)
      
      setTestResult({
        status: "success",
        message: "Storage access test successful! Your Firebase Storage permissions are working correctly."
      })
    } catch (error) {
      console.error("Storage test error:", error)
      setTestResult({
        status: "error",
        message: `Storage access test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }
  
  const refreshLogin = async () => {
    try {
      await auth.signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Troubleshooter</h1>
          <p className="text-muted-foreground">
            Diagnose and fix issues with document visibility
          </p>
        </div>
        <Link href="/dashboard/documents">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
            <CardDescription>Current document status in your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Firebase Documents:</span>
              <span className="font-semibold">{documents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Local Documents:</span>
              <span className="font-semibold">{localDocuments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>User Authenticated:</span>
              <span className="font-semibold">{user ? "Yes" : "No"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Storage Permission Test</CardTitle>
            <CardDescription>Test your Firebase Storage permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {testResult.status === "idle" && (
              <p>Click the button below to test your Firebase Storage permissions</p>
            )}
            
            {testResult.status === "testing" && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Testing storage access...</span>
              </div>
            )}
            
            {testResult.status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
            
            {testResult.status === "error" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button onClick={testStorageAccess} disabled={testResult.status === "testing"}>
              {testResult.status === "testing" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Test Storage Access
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={refreshLogin}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <LocalDocumentDisplay />
      
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Steps</CardTitle>
          <CardDescription>Follow these steps to resolve document visibility issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Refresh Your Login</h3>
            <p>Log out and log back in to refresh your authentication tokens.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">2. Deploy Firebase Storage Rules</h3>
            <p>Make sure your Firebase Storage rules allow authenticated users to access documents:</p>
            <pre className="bg-gray-100 p-3 rounded-md text-sm">
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
          
          <div className="space-y-2">
            <h3 className="font-semibold">3. Check Local Documents</h3>
            <p>
              If you uploaded documents while having permission issues, they might be stored locally.
              You can find them in the Local Documents section above.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">4. Clear Browser Cache</h3>
            <p>
              Try clearing your browser cache and reloading the page.
              This can fix issues with stale data or authentication tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 