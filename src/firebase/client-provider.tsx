'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import React from 'react';

// This provider is responsible for initializing Firebase on the client-side.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider value={{ firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
