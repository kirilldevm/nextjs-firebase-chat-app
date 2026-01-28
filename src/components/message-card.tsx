import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useGetUserById } from '../hooks/useGetUserById';
import type { TMessage } from '../types/message.type';
import type { TUser } from '../types/user.type';

type MessageCardProps = {
  message: TMessage;
  user: TUser;
};

export default function MessageCard({ message, user }: MessageCardProps) {
  const isSender = message.senderId === user.uid;
  const { user: senderUser } = useGetUserById(message.senderId);

  const timeAgo = useMemo(() => {
    if (!message.createdAt) return '';
    return dayjs(message.createdAt.toDate()).isSame(dayjs(), 'day')
      ? dayjs(message.createdAt.toDate()).format('HH:mm')
      : dayjs(message.createdAt.toDate()).format('DD/MM/YYYY HH:mm');
  }, [message.createdAt]);

  return (
    <li
      className={`flex flex-row items-center gap-2 ${isSender ? 'flex-row-reverse' : ''}`}
    >
      <div className="shrink-0 relative">
        {!senderUser?.avatarUrl ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={senderUser?.avatarUrl || ''}
              alt={senderUser?.username || ''}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
      </div>

      <div
        className={`flex flex-col p-2 rounded-lg ${isSender ? 'items-end bg-blue-300/50 text-white' : 'items-start bg-gray-200 text-black'} min-w-[100px]`}
      >
        {message.image && (
          <div className="shrink-0 relative max-w-60 max-h-60 h-full rounded-lg overflow-hidden">
            <img
              src={message.image}
              alt="Message image"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
        <p
          className={`text-xs w-full text-gray-500 text-right ${isSender ? 'text-left text-white/80' : 'text-right'}`}
        >
          {timeAgo.toString()}
        </p>
        <p
          className={`whitespace-pre-wrap ${message.image ? 'text-center' : ''}`}
        >
          {message.content}
        </p>
      </div>
    </li>
  );
}
