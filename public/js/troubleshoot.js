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
  
  // Check for Firebase Storage permission issues
  console.log("\n=== CHECKING FIREBASE STORAGE ===");
  
  // Try a test upload
  const testStorage = async () => {
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      
      if (!firebase || !firebase.storage) {
        console.log("Firebase Storage not available");
        return;
      }
      
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log("No user logged in");
        return;
      }
      
      const storageRef = firebase.storage().ref(`test-${currentUser.uid}-${Date.now()}`);
      
      console.log("Attempting test upload...");
      const uploadTask = storageRef.put(testBlob);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress.toFixed(2) + '%');
        },
        (error) => {
          console.error('Storage test error:', error.code, error.message);
          console.log('Permission issue detected:', error.code === 'storage/unauthorized');
          
          if (error.code === 'storage/unauthorized') {
            console.log('\nRECOMMENDATION: Firebase Storage rules need to be updated. Use the following rules:');
            console.log(`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
            `);
          }
        },
        () => {
          console.log('Test upload successful!');
          // Clean up the test file
          storageRef.delete().catch(e => console.log('Cleanup error:', e));
        }
      );
    } catch (e) {
      console.error("Storage test failed:", e);
    }
  };
  
  // Run the test
  testStorage();
  
  console.log("\n=== TROUBLESHOOTING STEPS ===");
  console.log("1. Try logging out and back in");
  console.log("2. Check the Firebase Console to confirm your documents exist");
  console.log("3. Clear your browser cache and reload");
  console.log("4. Try uploading a new document to test the system");
  console.log("5. If using local documents, check the Local Documents section");
  
  return {
    isLoggedIn: !!user,
    hasLocalDocuments: parsedLocalDocs.length > 0
  };
}

// Export for usage
if (typeof window !== 'undefined') {
  window.troubleshootDocuments = troubleshootDocuments;
}

// Log usage instructions
console.log("Document troubleshooter added. Run troubleshootDocuments() in the console to diagnose document visibility issues."); 