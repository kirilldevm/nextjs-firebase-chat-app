import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TUser } from '../types/user.type';

export function useGetUserById(userId: string) {
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      if (!userId) return;
      setLoading(true);
      const userRef = doc(firestore, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setUser(snapshot.data() as unknown as TUser);
      }
      setLoading(false);
    }
    getUser();
  }, [userId]);
  return { user, loading };
}
