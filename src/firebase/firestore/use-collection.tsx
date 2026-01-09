'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollection<T> {
  data: T[] | null;
  isLoading: boolean;
}

export function useCollection<T extends DocumentData>(
  q: Query | null
): UseCollection<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('useCollection error:', error);
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: (q as any)._path?.toString() || 'unknown collection',
            operation: 'list',
          })
        );
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, isLoading };
}
