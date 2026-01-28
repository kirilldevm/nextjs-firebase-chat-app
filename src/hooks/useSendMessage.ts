import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import { firestore } from '../lib/fitebase';
import type { TMessage } from '../types/message.type';

export function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function sendMessage(
    message: Omit<TMessage, 'id' | 'createdAt'>,
    chatroomId: string
  ) {
    try {
      setIsLoading(true);
      const messageRef = await addDoc(
        collection(firestore, `chatrooms/${chatroomId}/messages`),
        {
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId,
          createdAt: serverTimestamp(),
        }
      );

      const chatroomRef = doc(firestore, `chatrooms/${chatroomId}`);
      await updateDoc(chatroomRef, {
        lastMessage: {
          id: messageRef.id,
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId,
          createdAt: serverTimestamp(),
        },
      });

      setSuccess(true);
      setIsLoading(false);
      return messageRef.id;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
      return null;
    }
  }
  return { sendMessage, isLoading, error, success };
}
