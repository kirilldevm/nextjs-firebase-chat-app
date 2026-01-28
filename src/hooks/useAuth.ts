import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, firestore } from '../lib/fitebase';
import type { TUser } from '../types/user.type';

export function useAuth() {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as unknown as TUser);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user: user as unknown as TUser, loading };
}
