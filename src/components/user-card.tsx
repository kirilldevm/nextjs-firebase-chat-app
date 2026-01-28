import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { firestore } from '../lib/fitebase';
import { useStore } from '../store';
import type { TUser } from '../types/user.type';

type UserCardProps = {
  user: TUser;
};

export default function UserCard({ user }: UserCardProps) {
  const { setActiveTab } = useStore();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isCurrentUser = user.uid === currentUser?.uid;

  async function openChat() {
    // Check if chat is already exists
    const existingChatroom = query(
      collection(firestore, 'chatrooms'),
      where('users', 'array-contains-any', [user.uid, currentUser.uid])
    );

    try {
      const chatroom = await getDocs(existingChatroom);

      if (chatroom.docs.length > 0) {
        setActiveTab('chats');
        navigate(`/chat/${chatroom.docs[0].id}`);
        return;
      }

      // Create new chatroom
      const usersData = {
        [currentUser?.uid]: currentUser,
        [user.uid]: user,
      };

      const chatroomData = {
        users: [currentUser?.uid, user.uid],
        createdAt: serverTimestamp(),
        usersData,
        lastMessage: null,
      };

      const chatroomRef = await addDoc(
        collection(firestore, 'chatrooms'),
        chatroomData
      );

      toast.success('Chat started successfully');
      setActiveTab('chats');
      navigate(`/chat/${chatroomRef.id}`);
    } catch (error) {
      toast.error('Failed to start chat', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  if (isCurrentUser) {
    return null;
  }

  return (
    <li
      className="flex flex-row items-center hover:bg-gray-400/10 p-2 rounded-lg cursor-pointer"
      onClick={openChat}
    >
      <div className="shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-500">{user.username}</h3>
      </div>
    </li>
  );
}
