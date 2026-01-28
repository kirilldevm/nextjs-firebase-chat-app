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

  async function sendMessage(message: Partial<TMessage>, chatroomId: string) {
    try {
      setIsLoading(true);
      const messageData = {
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        createdAt: serverTimestamp(),
        ...(message.image != null && { image: message.image }),
      };
      const messageRef = await addDoc(
        collection(firestore, `chatrooms/${chatroomId}/messages`),
        messageData
      );

      const chatroomRef = doc(firestore, `chatrooms/${chatroomId}`);
      await updateDoc(chatroomRef, {
        lastMessage: {
          id: messageRef.id,
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId,
          createdAt: serverTimestamp(),
          ...(message.image != null && { image: message.image }),
        },
      });

      setSuccess(true);
      setIsLoading(false);
      return messageRef.id;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      console.log(error);
      setIsLoading(false);
      return null;
    }
  }
  return { sendMessage, isLoading, error, success };
}
