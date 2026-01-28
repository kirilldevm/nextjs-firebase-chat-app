import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TUser } from '../types/user.type';

export function useGetUsers() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data() as TUser);
      setUsers(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { users, loading };
}
