import type { Timestamp } from 'firebase/firestore';

export type TMessage = {
  id: string;
  content: string;
  senderId: string;
  image?: string;
  receiverId: string;
  createdAt: Timestamp;
};
