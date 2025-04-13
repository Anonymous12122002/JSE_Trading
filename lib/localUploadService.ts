"use client"

import { useState, useEffect } from 'react';

// Interface for document storage
export interface LocalDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  url: string;
  uploadedAt: Date;
  data: Blob | File;
}

// Storage key
const LOCAL_DOCUMENTS_KEY = 'local_temp_documents';

/**
 * Service to handle document uploads locally when Firebase Storage is unavailable
 */
export const localUploadService = {
  /**
   * Store a file locally and return a temporary URL
   * @param file The file to store
   * @param type The document type
   * @returns Promise with document info
   */
  uploadDocument: async (file: File, type: string): Promise<LocalDocument> => {
    // Create a temporary URL for the file
    const url = URL.createObjectURL(file);
    
    // Create a document object
    const document: LocalDocument = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      type,
      size: file.size,
      lastModified: file.lastModified,
      url,
      uploadedAt: new Date(),
      data: file
    };
    
    // Store in local storage
    const existingDocs = localUploadService.getDocuments();
    const updatedDocs = [...existingDocs, document];
    
    // Store references only in localStorage, not the full files
    const docRefs = updatedDocs.map(doc => ({
      ...doc,
      data: null // Don't store the actual file data in localStorage
    }));
    
    localStorage.setItem(LOCAL_DOCUMENTS_KEY, JSON.stringify(docRefs));
    
    // Store the document in memory
    localDocumentCache.set(document.id, document);
    
    return document;
  },
  
  /**
   * Get all locally stored documents
   */
  getDocuments: (): LocalDocument[] => {
    try {
      const storedDocs = localStorage.getItem(LOCAL_DOCUMENTS_KEY);
      if (!storedDocs) return [];
      
      const parsedDocs = JSON.parse(storedDocs);
      
      // Reconstruct with cached data
      return parsedDocs.map((doc: any) => {
        const cachedDoc = localDocumentCache.get(doc.id);
        if (cachedDoc) {
          return cachedDoc;
        }
        
        // If not in cache, return just the metadata
        return {
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
          data: null
        };
      });
    } catch (error) {
      console.error('Error retrieving local documents:', error);
      return [];
    }
  },
  
  /**
   * Get a document by ID
   */
  getDocument: (id: string): LocalDocument | null => {
    const cachedDoc = localDocumentCache.get(id);
    if (cachedDoc) return cachedDoc;
    
    const docs = localUploadService.getDocuments();
    return docs.find(doc => doc.id === id) || null;
  },
  
  /**
   * Delete a document
   */
  deleteDocument: (id: string): boolean => {
    try {
      const docs = localUploadService.getDocuments();
      const docToDelete = docs.find(doc => doc.id === id);
      
      if (docToDelete && docToDelete.url) {
        // Revoke the object URL
        URL.revokeObjectURL(docToDelete.url);
      }
      
      // Remove from cache
      localDocumentCache.delete(id);
      
      // Update local storage
      const updatedDocs = docs.filter(doc => doc.id !== id);
      const docRefs = updatedDocs.map(doc => ({
        ...doc,
        data: null
      }));
      
      localStorage.setItem(LOCAL_DOCUMENTS_KEY, JSON.stringify(docRefs));
      return true;
    } catch (error) {
      console.error('Error deleting local document:', error);
      return false;
    }
  },
  
  /**
   * Clear all documents
   */
  clearDocuments: (): void => {
    try {
      // Revoke all URLs
      const docs = localUploadService.getDocuments();
      docs.forEach(doc => {
        if (doc.url) {
          URL.revokeObjectURL(doc.url);
        }
      });
      
      // Clear cache
      localDocumentCache.clear();
      
      // Clear storage
      localStorage.removeItem(LOCAL_DOCUMENTS_KEY);
    } catch (error) {
      console.error('Error clearing local documents:', error);
    }
  }
};

// In-memory cache for document objects with their binary data
const localDocumentCache = new Map<string, LocalDocument>();

// Hook for using local documents
export function useLocalDocuments() {
  const [documents, setDocuments] = useState<LocalDocument[]>([]);
  
  useEffect(() => {
    // Load documents on mount
    setDocuments(localUploadService.getDocuments());
    
    // Setup event listener for storage changes from other tabs
    const handleStorageChange = () => {
      setDocuments(localUploadService.getDocuments());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return {
    documents,
    uploadDocument: localUploadService.uploadDocument,
    getDocument: localUploadService.getDocument,
    deleteDocument: (id: string) => {
      const result = localUploadService.deleteDocument(id);
      if (result) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
      return result;
    },
    clearDocuments: () => {
      localUploadService.clearDocuments();
      setDocuments([]);
    }
  };
} 