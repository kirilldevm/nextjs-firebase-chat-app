import { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

type MessageInputProps = {
  onSend: (message: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend(message);
    setMessage('');
  };

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-row items-center gap-2 border-t px-4 py-2">
      {/* Attach file */}
      <FaPaperclip className="w-4 h-4 cursor-pointer" />

      {/* Message input */}
      <textarea
        className="flex-1 resize-none overflow-hidden p-2 rounded-lg border-gray-300 focus:outline-none"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={1}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSend} title="Send">
        <FaPaperPlane className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  );
}
