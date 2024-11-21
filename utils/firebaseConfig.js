import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Prevent multiple app initializations
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    // Attempt Firebase Google Sign-In
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Get Firebase ID Token
    const firebaseToken = await user.getIdToken();

    // Send token to your WordPress API to create/link account
    const response = await fetch('/api/auth/firebase-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseToken,
        email: user.email,
        displayName: user.displayName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with WordPress');
    }

    const { token } = await response.json();

    // Store tokens securely (e.g., in secure HttpOnly cookies or encrypted localStorage)
    localStorage.setItem('wp_token', token);

    return {
      firebaseUser: user,
      wpToken: token
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Sign out from Firebase
    await firebaseSignOut(auth);

    // Clear WordPress token
    localStorage.removeItem('wp_token');
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

export { auth };
