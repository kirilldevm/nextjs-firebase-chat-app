import type { TMessage } from './message.type';
import type { TUser } from './user.type';

export type TChatroom = {
  id: string;
  users: string[];
  usersData: Record<string, TUser>;
  createdAt: Date;
  lastMessage: TMessage | null;
};
