// Troubleshooting script for document visibility issues

/**
 * This function will help diagnose why documents aren't visible
 * Run this in your browser console when on the Documents page
 */
function troubleshootDocuments() {
  console.log("=== DOCUMENT VISIBILITY TROUBLESHOOTER ===");
  
  // Check if Firebase is initialized
  try {
    const firebaseApp = window.firebase?.app;
    console.log("Firebase initialized:", !!firebaseApp);
  } catch (e) {
    console.log("Firebase not accessible from window object");
  }
  
  // Check auth state
  const user = JSON.parse(localStorage.getItem("firebase:authUser") || "null");
  console.log("User logged in:", !!user);
  if (user) {
    console.log("User ID:", user.uid);
    console.log("Last login:", new Date(user.lastLoginAt).toLocaleString());
  }
  
  // Check for local documents
  const localDocs = localStorage.getItem("local_temp_documents");
  const parsedLocalDocs = localDocs ? JSON.parse(localDocs) : [];
  console.log("Local documents found:", parsedLocalDocs.length);
  
  // Check if any context providers might be missing
  const possibleErrors = [];
  
  if (!document.querySelector("[data-document-provider='true']")) {
    possibleErrors.push("DocumentProvider might not be properly mounted");
  }
  
  if (!document.querySelector("[data-auth-provider='true']")) {
    possibleErrors.push("AuthProvider might not be properly mounted");
  }
  
  if (possibleErrors.length > 0) {
    console.log("Possible React context issues:");
    possibleErrors.forEach(err => console.log(" - " + err));
  } else {
    console.log("React context providers appear to be properly mounted");
  }
  
  console.log("\n=== TROUBLESHOOTING STEPS ===");
  console.log("1. Try logging out and back in");
  console.log("2. Check the Firebase Console to confirm your documents exist");
  console.log("3. Clear your browser cache and reload");
  console.log("4. Try uploading a new document to test the system");
  console.log("5. If using local documents, check the Local Documents section");
  
  return {
    isLoggedIn: !!user,
    hasLocalDocuments: parsedLocalDocs.length > 0,
    possibleIssues: possibleErrors
  };
}

// Export for usage
if (typeof window !== 'undefined') {
  window.troubleshootDocuments = troubleshootDocuments;
}

// Log usage instructions
console.log("Document troubleshooter added. Run troubleshootDocuments() in the console to diagnose document visibility issues."); 