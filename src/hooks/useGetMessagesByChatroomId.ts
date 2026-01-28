import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TMessage } from '../types/message.type';

export function useGetMessagesByChatroomId(chatroomId: string) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const messagesRef = query(
      collection(firestore, `chatrooms/${chatroomId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(100)
    );
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TMessage)
      );
      setLoading(false);
    });
    return () => unsubscribe();
  }, [chatroomId]);

  return { messages, loading };
}
