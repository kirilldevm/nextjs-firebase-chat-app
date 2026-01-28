import type { TUser } from '../types/user.type';
import UserCard from './user-card';

export default function Users({ users }: { users: TUser[] }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="flex flex-col gap-1">
        {users.map((user) => (
          <UserCard key={user.uid} user={user} />
        ))}
      </ul>
    </div>
  );
}
