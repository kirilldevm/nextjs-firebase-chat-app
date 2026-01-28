import EmojiPicker from 'emoji-picker-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { FaPaperclip, FaPaperPlane, FaSmile } from 'react-icons/fa';
import { toast } from 'sonner';
import { storage } from '../lib/fitebase';

type MessageInputProps = {
  onSend: (message: string, imageUrl: string | null) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLButtonElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleSend = () => {
    onSend(message, imageUrl);
    setMessage('');
  };

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEmojiClick(emoji: string) {
    setMessage((prev) => prev + emoji);
  }

  async function handleUploadFile() {
    if (!file) return;
    const storageRef = ref(storage, `chatroom_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error instanceof Error ? error.message : 'Unknown error');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          toast.success('File uploaded successfully');
          setImageUrl(url);
          setIsUploading(false);
          setFile(null);
          setImagePreview(null);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        });
      }
    );
  }

  useEffect(() => {
    function handleClickOutsideEmojiPicker(e: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.EmojiPickerReact')
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('click', handleClickOutsideEmojiPicker);
    return () =>
      document.removeEventListener('click', handleClickOutsideEmojiPicker);
  }, []);

  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showEmojiPicker]);

  return (
    <div className="flex flex-row items-center gap-2 border-t px-4 py-2">
      {/* Attach file */}
      <FaPaperclip
        className={`w-4 h-4 cursor-pointer ${imageUrl ? 'text-blue-400' : ''}`}
        onClick={() => setIsUploading(true)}
      />

      {/* Emoji picker */}
      <button
        ref={emojiPickerRef}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <FaSmile />
      </button>

      {showEmojiPicker && (
        <div className={`absolute bottom-0 left-0`}>
          <EmojiPicker
            onEmojiClick={(emoji) => handleEmojiClick(emoji.emoji)}
          />
        </div>
      )}

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

      <dialog className="modal" id="upload-file-modal" open={isUploading}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">Uploading file</h3>

          {imagePreview && (
            <div className="w-full h-60 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}
          <input
            type="file"
            title="Attach file"
            placeholder="Attach file"
            aria-label="Attach file"
            accept="image/*"
            onChange={(e) => {
              handleFileChange(e);
              // handleUploadFile();
            }}
            className="hidden"
            ref={fileInputRef}
          />

          {uploadProgress > 0 && (
            <progress
              value={uploadProgress}
              max={100}
              className="progress progress-primary w-full"
            ></progress>
          )}

          <div className="modal-action">
            <button
              className="btn btn-sm btn-primary"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </button>
            <button
              className="btn btn-sm btn-primary"
              type="button"
              disabled={!file}
              onClick={handleUploadFile}
            >
              Upload
            </button>
            <button
              className="btn btn-sm btn-error"
              type="button"
              onClick={() => {
                setImagePreview(null);
                setIsUploading(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
