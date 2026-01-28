import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useGetChatroom } from '../hooks/useGetChatroom';
import { useGetMessagesByChatroomId } from '../hooks/useGetMessagesByChatroomId';
import { useSendMessage } from '../hooks/useSendMessage';
import type { TUser } from '../types/user.type';
import MessageCard from './message-card';
import MessageInput from './message-input';

export default function Chatroom({ id }: { id: string }) {
  const { chatroom, isLoading } = useGetChatroom(id);
  const { sendMessage } = useSendMessage();
  const { messages } = useGetMessagesByChatroomId(id);
  const ref = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!messages?.length || !ref.current) return;
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, ref]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="text-red-500 text-center">Chatroom not found</span>
      </div>
    );
  }

  async function handleSendMessage(message: string, imageUrl: string | null) {
    const messageData = {
      content: message,
      senderId: user?.uid as string,
      receiverId: chatroom?.users.find(
        (userId) => userId !== user?.uid
      ) as string,
      ...(imageUrl != null && { image: imageUrl }),
    };
    const messageId = await sendMessage(messageData, id);
    if (!messageId) {
      toast.error('Failed to send message');
    }
  }

  return (
    <div className="flex flex-col h-full w-full flex-1">
      <div className="overflow-auto" ref={ref}>
        <div className="flex-1 p-10 gap-2 flex flex-col justify-end">
          <ul className="flex-1 gap-2 flex flex-col justify-end">
            {messages?.length &&
              messages?.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  user={user || ({} as TUser)}
                />
              ))}
          </ul>
        </div>
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
