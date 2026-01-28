import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TChatroom } from '../types/chatroom.type';

export function useGetChatroomsByUserId(userId: string) {
  const [chatrooms, setChatrooms] = useState<TChatroom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const q = query(
      collection(firestore, 'chatrooms'),
      where('users', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setChatrooms(
        querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as TChatroom
        )
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);
  return { chatrooms, loading };
}
