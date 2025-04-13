"use client"

import { useLocalDocuments, type LocalDocument } from "@/lib/localUploadService"
import { FileText, Download, Trash2, Cloud, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"

export function LocalDocumentDisplay() {
  const { documents, deleteDocument, clearDocuments } = useLocalDocuments()
  
  if (documents.length === 0) {
    return null
  }
  
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Local Document Storage</AlertTitle>
        <AlertDescription>
          These documents are temporarily stored in your browser due to Firebase Storage issues.
          When Firebase becomes available, you should upload these documents again.
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Local Documents ({documents.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearDocuments}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <LocalDocumentCard 
            key={doc.id} 
            document={doc} 
            onDelete={() => deleteDocument(doc.id)} 
          />
        ))}
      </div>
    </div>
  )
}

function LocalDocumentCard({ 
  document, 
  onDelete 
}: { 
  document: LocalDocument
  onDelete: () => void
}) {
  const handleDownload = () => {
    const link = document.url ? document.url : URL.createObjectURL(document.data)
    const a = window.document.createElement('a')
    a.href = link
    a.download = document.name
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    
    if (!document.url) {
      URL.revokeObjectURL(link)
    }
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {document.name}
            </CardTitle>
            <CardDescription className="mt-1">
              Locally stored document
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            Local
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type:</span>
            <span className="text-sm text-muted-foreground">
              {document.type.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Size:</span>
            <span className="text-sm text-muted-foreground">
              {(document.size / 1024).toFixed(1)} KB
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Added:</span>
            <span className="text-sm text-muted-foreground">
              {format(document.uploadedAt, "MMM d, yyyy h:mm a")}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => window.open(document.url, "_blank")}
        >
          <FileText className="mr-2 h-4 w-4" />
          View
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 