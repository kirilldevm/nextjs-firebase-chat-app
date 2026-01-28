type ChatCardProps = {
  onClick: () => void;
  name: string;
  avatarUrl: string;
  latestMessage: string;
  time?: string;
  selected: boolean;
};

export default function ChatCard({
  onClick,
  name,
  avatarUrl,
  latestMessage,
  time,
  selected,
}: ChatCardProps) {
  return (
    <li
      className={`flex flex-row items-center hover:bg-gray-400/10 p-2 rounded-lg cursor-pointer ${selected ? 'bg-gray-400/10' : ''}`}
      onClick={onClick}
    >
      <div className="shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex flex-row items-center justify-between gap-2">
          <h3 className="text-sm font-bol">{name}</h3>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
        <p className="text-sm text-gray-500 truncate">{latestMessage}</p>
      </div>
    </li>
  );
}
