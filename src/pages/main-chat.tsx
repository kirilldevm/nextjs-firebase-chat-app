import { useParams } from 'react-router';
import Chatroom from '../components/chatroom';

export default function MainChat() {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="text-red-500 text-center">Chatroom not found</span>
      </div>
    );
  }

  return <Chatroom id={id} />;
}
