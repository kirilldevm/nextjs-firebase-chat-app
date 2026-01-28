import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import MessageCard from '../components/message-card';
import MessageInput from '../components/message-input';
import { useAuth } from '../hooks/useAuth';
import { useGetChatroom } from '../hooks/useGetChatroom';
import { useGetMessagesByChatroomId } from '../hooks/useGetMessagesByChatroomId';
import { useSendMessage } from '../hooks/useSendMessage';
import type { TUser } from '../types/user.type';

export default function MainChat() {
  const { id } = useParams();

  const { user, loading } = useAuth();
  const { chatroom, isLoading } = useGetChatroom(id as string);
  const { sendMessage } = useSendMessage();
  const { messages } = useGetMessagesByChatroomId(id as string);
  const ref = useRef<HTMLDivElement>(null);

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
    console.log(message, imageUrl);
    const messageData = {
      content: message,
      senderId: user?.uid as string,
      receiverId: chatroom!.users.find((userId) => userId !== user?.uid)!,
      ...(imageUrl != null && { image: imageUrl }),
    };
    const messageId = await sendMessage(messageData, id as string);
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
                  user={user as TUser}
                />
              ))}
          </ul>
        </div>
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
