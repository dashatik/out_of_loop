import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
// For production, use service account credentials
// For development, we'll use the client SDK validation as fallback
export function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Only initialize if using service account (production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );

      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Development mode - use client-side verification
      // This is less secure but allows local development
      console.warn('Firebase Admin not initialized - missing FIREBASE_SERVICE_ACCOUNT_KEY');
      return null;
    }
  }

  return getAuth();
}

export async function verifyIdToken(token: string) {
  const auth = getFirebaseAdmin();

  if (!auth) {
    // In development mode without service account
    // We can't verify tokens server-side
    // This should only be used for local development
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Invalid authentication token');
  }
}
