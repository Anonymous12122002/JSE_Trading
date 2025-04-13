// Deploy Firebase Storage Rules
// This file helps you deploy the storage.rules to your Firebase project

console.log('To deploy your Firebase Storage rules, run the following commands:');
console.log('');
console.log('1. Install Firebase CLI if you haven\'t already:');
console.log('   npm install -g firebase-tools');
console.log('');
console.log('2. Login to Firebase:');
console.log('   firebase login');
console.log('');
console.log('3. Initialize Firebase in this project (if not already done):');
console.log('   firebase init');
console.log('');
console.log('4. Deploy the storage rules:');
console.log('   firebase deploy --only storage');
console.log('');
console.log('This will fix the "Missing or insufficient permissions" error by updating');
console.log('your Firebase Storage security rules to allow authenticated users to read and write files.'); 