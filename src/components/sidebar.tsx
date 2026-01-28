import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useGetUsers } from '../hooks/useGetUsers';
import { auth } from '../lib/fitebase';
import { useStore } from '../store';
import Chats from './chats';

import Users from './users';

export default function Sidebar() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useStore((state) => state);
  // Get all users
  const { users, loading } = useGetUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      })
      .catch((error) => {
        toast.error('Failed to logout', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      });
  }
  return (
    <div className="flex flex-col h-full w-3/12 shrink-0 min-w-58 p-4 gap-2 border-r">
      <div className="flex flex-row items-center justify-between rounded-lg">
        <button
          onClick={() => setActiveTab('users')}
          className={`${activeTab === 'users' ? 'bg-primary text-white' : ''} btn btn-ghost p-1 text-sm`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`${activeTab === 'chats' ? 'bg-primary text-white' : ''} btn btn-ghost p-1 text-sm`}
        >
          Chats
        </button>
      </div>
      {activeTab === 'users' && <Users users={users} />}
      {activeTab === 'chats' && <Chats />}

      <div className="mt-auto">
        <button className="btn btn-error w-full" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
