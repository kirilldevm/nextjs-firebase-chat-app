import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useGetChatroomsByUserId } from '../hooks/useGetChatroomsByUserId';
import { useStore } from '../store';
import ChatCard from './chat-card';

export default function Chats() {
  const { user } = useAuth();
  const { id } = useParams();
  const { chatrooms, loading } = useGetChatroomsByUserId(user?.uid as string);
  const { setActiveTab } = useStore();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  function handleSelectChat(chatroomId: string) {
    setActiveTab('chats');
    navigate(`/chat/${chatroomId}`);
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <h2 className="text-2xl font-bold">Chats</h2>
      <ul className="flex flex-col gap-1">
        {chatrooms.map((chatroom) => {
          const otherUser = Object.keys(chatroom.usersData).find(
            (userId) => userId !== user?.uid
          );

          if (!otherUser) return null;

          return (
            <ChatCard
              onClick={() => handleSelectChat(chatroom.id)}
              selected={id === chatroom.id}
              key={chatroom.id}
              name={chatroom.usersData[otherUser].username}
              avatarUrl={chatroom.usersData[otherUser].avatarUrl}
              latestMessage={chatroom.lastMessage?.content || ''}
              time={
                dayjs(chatroom.lastMessage?.createdAt?.toDate()).isSame(
                  dayjs(),
                  'day'
                )
                  ? dayjs(chatroom.lastMessage?.createdAt?.toDate()).format(
                      'HH:mm'
                    )
                  : dayjs(chatroom.lastMessage?.createdAt?.toDate()).format(
                      'DD/MM/YYYY HH:mm'
                    )
              }
            />
          );
        })}
      </ul>
    </div>
  );
}
