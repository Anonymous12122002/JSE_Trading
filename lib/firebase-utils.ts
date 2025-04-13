"use client"

import { auth, storage, firestore } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, getDocs, limit, query } from 'firebase/firestore'

/**
 * Tests Firebase authentication status
 * @returns Authentication status object
 */
export async function testAuth() {
  try {
    const user = auth.currentUser
    
    return {
      authenticated: !!user,
      userId: user?.uid,
      email: user?.email,
      status: 'success'
    }
  } catch (error) {
    console.error('Auth test error:', error)
    return {
      authenticated: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Tests Firebase Storage access
 * @returns Test result object
 */
export async function testStorage() {
  try {
    if (!auth.currentUser) {
      return { 
        status: 'error', 
        error: 'User not authenticated' 
      }
    }

    // Create a tiny test file
    const testData = new Blob(['test-file-content'], { type: 'text/plain' })
    
    // Try uploading to a test location
    const fileName = `test-file-${Date.now()}.txt`
    const testRef = ref(storage, `test/${auth.currentUser.uid}/${fileName}`)
    
    // Set a 10-second timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Storage operation timed out')), 10000)
    })
    
    // Try the upload with timeout
    const uploadResult = await Promise.race([
      uploadBytes(testRef, testData),
      timeoutPromise
    ])
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(testRef)
    
    return {
      status: 'success',
      url: downloadUrl,
      storageRef: testRef.fullPath
    }
  } catch (error) {
    console.error('Storage test error:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Tests Firebase Firestore access
 * @returns Test result object
 */
export async function testFirestore() {
  try {
    // Try to read a single document from any collection
    const docQuery = query(collection(firestore, 'documents'), limit(1))
    const snapshot = await getDocs(docQuery)
    
    return {
      status: 'success',
      empty: snapshot.empty,
      count: snapshot.size
    }
  } catch (error) {
    console.error('Firestore test error:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Runs Firebase diagnostics tests
 * @returns Diagnostics results object
 */
export async function runFirebaseDiagnostics() {
  const authResult = await testAuth()
  const storageResult = await testStorage()
  const firestoreResult = await testFirestore()
  
  return {
    auth: authResult,
    storage: storageResult,
    firestore: firestoreResult,
    timestamp: new Date().toISOString(),
    browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    storageError: storageResult.status === 'error' ? 
      getStorageErrorHelp(storageResult.error as string) : null
  }
}

/**
 * Gets help text for common Firebase Storage errors
 * @param errorText The error message text
 * @returns Help message with possible solutions
 */
function getStorageErrorHelp(errorText: string): string {
  if (!errorText) return 'Unknown error'
  
  const lowerError = errorText.toLowerCase()
  
  // Analyze the error text for common patterns
  if (lowerError.includes('retry-limit-exceeded') || lowerError.includes('max retry time')) {
    return 'Firebase Storage timed out. This is usually caused by network issues or restrictive security rules. '
      + 'Possible solutions: check your internet connection, try a different network, or review your Firebase Storage rules.'
  }
  
  if (lowerError.includes('unauthorized') || lowerError.includes('permission')) {
    return 'Permission denied. Your Firebase Storage rules are preventing the upload. '
      + 'Update your Firebase Storage rules to allow authenticated users to upload files.'
  }
  
  if (lowerError.includes('not authenticated') || lowerError.includes('unauthenticated')) {
    return 'Authentication required. You need to be logged in to upload files. '
      + 'Try logging out and back in to refresh your authentication token.'
  }
  
  if (lowerError.includes('cors')) {
    return 'CORS error. Your Firebase project needs to have CORS configured properly. '
      + 'Update your Firebase Storage CORS configuration in the Firebase Console.'
  }
  
  if (lowerError.includes('quota') || lowerError.includes('limit')) {
    return 'Storage quota exceeded or rate limit hit. '
      + 'Your Firebase project may have reached its storage or bandwidth limits.'
  }
  
  return 'General Firebase Storage error. Try refreshing the page, checking your internet connection, or logging out and back in.'
} 