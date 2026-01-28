import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TChatroom } from '../types/chatroom.type';

export function useGetChatroom(id: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [chatroom, setChatroom] = useState<TChatroom | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const chatroomRef = doc(firestore, `chatrooms/${id}`);
    const unsubscribe = onSnapshot(chatroomRef, (snapshot) => {
      setChatroom(snapshot.data() as TChatroom);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  return { chatroom, isLoading };
}
