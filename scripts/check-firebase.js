/**
 * Firebase Configuration Checker
 * 
 * This script helps diagnose issues with Firebase configuration.
 * Run it with: node scripts/check-firebase.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking Firebase configuration...\n');

// Check if .env.local file exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
  
  // Read and check environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim());
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length) {
    console.log('❌ Missing environment variables:', missingVars.join(', '));
  } else {
    console.log('✅ All required Firebase environment variables found');
  }
} else {
  console.log('❌ .env.local file not found! Create this file with your Firebase configuration.');
}

// Check Firebase dependencies
console.log('\n📦 Checking Firebase dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  if (dependencies.firebase) {
    console.log(`✅ Firebase package found (version: ${dependencies.firebase})`);
    
    // Check if firebase-admin is needed
    if (fs.existsSync(path.join(process.cwd(), 'app/api/upload/route.ts'))) {
      if (dependencies['firebase-admin']) {
        console.log(`✅ firebase-admin package found (version: ${dependencies['firebase-admin']})`);
      } else {
        console.log('⚠️ firebase-admin package not found but may be needed for server API routes');
        console.log('   Run: npm install firebase-admin');
      }
    }
  } else {
    console.log('❌ Firebase package not found in dependencies!');
    console.log('   Run: npm install firebase');
  }
} catch (err) {
  console.log('❌ Error reading package.json:', err.message);
}

// Check Firebase configuration file
console.log('\n🔧 Checking Firebase configuration file...');
const firebaseConfigPath = path.join(process.cwd(), 'lib/firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  console.log('✅ Firebase configuration file found at lib/firebase.ts');
  
  const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
  if (firebaseConfig.includes('getAuth') && 
      firebaseConfig.includes('getStorage') && 
      firebaseConfig.includes('getFirestore')) {
    console.log('✅ Firebase services properly initialized (Auth, Storage, Firestore)');
  } else {
    console.log('⚠️ Some Firebase services may not be properly initialized');
    if (!firebaseConfig.includes('getAuth')) {
      console.log('   - Authentication service not found');
    }
    if (!firebaseConfig.includes('getStorage')) {
      console.log('   - Storage service not found');
    }
    if (!firebaseConfig.includes('getFirestore')) {
      console.log('   - Firestore service not found');
    }
  }
} else {
  console.log('❌ Firebase configuration file not found at lib/firebase.ts');
}

// Check network connectivity
console.log('\n🌐 Checking network connectivity to Firebase...');
try {
  console.log('  Trying to reach Firebase services...');
  execSync('ping -c 1 firestore.googleapis.com', { stdio: 'ignore' });
  console.log('✅ Network connectivity to Firebase services appears to be working');
} catch (err) {
  console.log('⚠️ Could not reach Firebase services. Check your internet connection or firewall settings.');
}

// Network connectivity test for Windows
try {
  execSync('ping -n 1 firestore.googleapis.com', { stdio: 'ignore' });
  console.log('✅ Windows network test: Firebase services are reachable');
} catch (err) {
  // Already showed a warning above
}

console.log('\n📋 Summary:');
console.log('1. Ensure you are logged in to your Firebase account in the browser');
console.log('2. Check that your Firebase project has Storage and Firestore enabled');
console.log('3. Verify that your Firebase Security Rules allow uploads');
console.log('4. Make sure CORS is properly configured for your Firebase project');
console.log('\nFor more help, visit https://firebase.google.com/docs/web/setup'); 