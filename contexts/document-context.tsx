"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage"
import { firestore, storage } from "@/lib/firebase"
import { useAuth } from "./auth-context"

export type DocumentType =
  | "driverLicense"
  | "trainingCertificate"
  | "medicalReport"
  | "vehicleRegistration"
  | "insurancePolicy"
  | "pucCertificate"
  | "deliveryReceipt"
  | "tollInvoice"

export type DocumentStatus = "active" | "expired" | "expiring"

export interface Document {
  id: string
  userId: string
  type: DocumentType
  name: string
  url: string
  fileType: string
  size: number
  uploadedAt: Date
  expiryDate?: Date
  status: DocumentStatus
  entityId?: string // ID of related driver/vehicle
  entityType?: "driver" | "vehicle" | "trip"
  version: number
  metadata?: Record<string, any>
}

type DocumentContextType = {
  documents: Document[]
  loading: boolean
  uploadDocument: (
    file: File,
    type: DocumentType,
    metadata: {
      expiryDate?: Date
      entityId?: string
      entityType?: "driver" | "vehicle" | "trip"
    }
  ) => Promise<Document>
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  bulkUpload: (files: File[], type: DocumentType) => Promise<Document[]>
  bulkDownload: (documentIds: string[]) => Promise<void>
  getExpiringDocuments: () => Document[]
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [storageReady, setStorageReady] = useState(false)

  // Check if storage is accessible
  useEffect(() => {
    const checkStorage = async () => {
      if (!user) return;

      try {
        // Try creating a test reference to see if we have access
        const testRef = ref(storage, `test-${user.uid}-${Date.now()}`);
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        await uploadBytes(testRef, testBlob);
        await deleteObject(testRef);
        console.log("Storage access verified successfully");
        setStorageReady(true);
      } catch (error) {
        console.error("Storage access check failed:", error);
        setStorageReady(false);
      }
    };

    checkStorage();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setDocuments([])
      setLoading(false)
      return
    }

    // Subscribe to documents collection
    const q = query(
      collection(firestore, "documents"),
      where("userId", "==", user.uid),
      orderBy("uploadedAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Document[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        docs.push({
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt.toDate(),
          expiryDate: data.expiryDate?.toDate(),
        } as Document)
      })
      setDocuments(docs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Add a fallback upload method using fetch API
  const uploadDocumentFallback = async (
    file: File,
    type: DocumentType,
    metadata: {
      expiryDate?: Date
      entityId?: string
      entityType?: "driver" | "vehicle" | "trip"
    }
  ): Promise<Document> => {
    console.log("DocumentContext - Using fallback upload method");
    
    if (!user) {
      throw new Error("Must be logged in to upload documents");
    }
    
    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("userId", user.uid);
      
      if (metadata.expiryDate) {
        formData.append("expiryDate", metadata.expiryDate.toISOString());
      }
      
      if (metadata.entityId) {
        formData.append("entityId", metadata.entityId);
      }
      
      if (metadata.entityType) {
        formData.append("entityType", metadata.entityType);
      }
      
      // Send to API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      
      const result = await response.json();
      
      // Create document object from result
      const docData: Omit<Document, "id"> = {
        userId: user.uid,
        type,
        name: file.name,
        url: result.url,
        fileType: file.type,
        size: file.size,
        uploadedAt: new Date(),
        expiryDate: metadata.expiryDate,
        status: "active",
        entityId: metadata.entityId,
        entityType: metadata.entityType,
        version: 1,
        metadata: {},
      };
      
      return { id: result.documentId, ...docData };
    } catch (error) {
      console.error("DocumentContext - Fallback upload error:", error);
      throw error;
    }
  };

  // Update the main upload function to try fallback if direct upload fails
  const uploadDocument = async (
    file: File,
    type: DocumentType,
    metadata: {
      expiryDate?: Date
      entityId?: string
      entityType?: "driver" | "vehicle" | "trip"
    }
  ): Promise<Document> => {
    console.log("DocumentContext - uploadDocument called with:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      docType: type,
      metadata
    });

    if (!user) {
      console.error("DocumentContext - User not authenticated");
      throw new Error("Must be logged in to upload documents");
    }

    // Adding additional safeguards for file
    if (!file || file.size === 0) {
      throw new Error("Invalid file: The file is empty or corrupted");
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large: Maximum file size is 5MB");
    }

    try {
      // Try direct upload first
      console.log("DocumentContext - Attempting direct upload");
      
      if (!storageReady) {
        console.warn("DocumentContext - Storage not confirmed ready, trying anyway");
      }

      console.log("DocumentContext - Creating storage reference");
      // Upload file to Storage
      const storageRef = ref(storage, `documents/${user.uid}/${type}/${file.name}`);
      console.log("DocumentContext - Starting file upload to storage");
      await uploadBytes(storageRef, file);
      console.log("DocumentContext - File uploaded to storage, getting download URL");
      const url = await getDownloadURL(storageRef);
      console.log("DocumentContext - Got download URL:", url.substring(0, 50) + '...');

      // Get current version number
      console.log("DocumentContext - Calculating document version");
      const currentVersions = documents.filter(
        (doc) =>
          doc.type === type &&
          doc.entityId === metadata.entityId &&
          doc.entityType === metadata.entityType
      );
      const version = currentVersions.length + 1;
      console.log("DocumentContext - Document version:", version);

      // Create document record in Firestore
      console.log("DocumentContext - Creating document data for Firestore");
      const docData: Omit<Document, "id"> = {
        userId: user.uid,
        type,
        name: file.name,
        url,
        fileType: file.type,
        size: file.size,
        uploadedAt: new Date(),
        expiryDate: metadata.expiryDate,
        status: "active",
        entityId: metadata.entityId,
        entityType: metadata.entityType,
        version,
        metadata: {},
      };

      console.log("DocumentContext - Adding document to Firestore");
      const docRef = await addDoc(collection(firestore, "documents"), docData);
      console.log("DocumentContext - Document added to Firestore with ID:", docRef.id);
      
      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error("DocumentContext - Error in direct upload:", error);
      
      // Try fallback method
      console.log("DocumentContext - Trying fallback upload method");
      try {
        return await uploadDocumentFallback(file, type, metadata);
      } catch (fallbackError) {
        console.error("DocumentContext - Fallback upload also failed:", fallbackError);
        throw fallbackError;
      }
    }
  }

  const updateDocument = async (id: string, data: Partial<Document>) => {
    if (!user) throw new Error("Must be logged in to update documents")

    const docRef = doc(firestore, "documents", id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    })
  }

  const deleteDocument = async (id: string) => {
    if (!user) throw new Error("Must be logged in to delete documents")

    const document = documents.find((doc) => doc.id === id)
    if (!document) throw new Error("Document not found")

    // Delete from Storage
    const storageRef = ref(storage, document.url)
    await deleteObject(storageRef)

    // Delete from Firestore
    await deleteDoc(doc(firestore, "documents", id))
  }

  const bulkUpload = async (files: File[], type: DocumentType): Promise<Document[]> => {
    const uploadedDocs: Document[] = []
    for (const file of files) {
      const doc = await uploadDocument(file, type, {})
      uploadedDocs.push(doc)
    }
    return uploadedDocs
  }

  const bulkDownload = async (documentIds: string[]) => {
    const selectedDocs = documents.filter((doc) => documentIds.includes(doc.id))
    for (const doc of selectedDocs) {
      const response = await fetch(doc.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const getExpiringDocuments = () => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return documents.filter((doc) => {
      if (!doc.expiryDate) return false
      return doc.expiryDate <= thirtyDaysFromNow
    })
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        uploadDocument,
        updateDocument,
        deleteDocument,
        bulkUpload,
        bulkDownload,
        getExpiringDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
} 