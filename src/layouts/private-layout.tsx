import { Navigate, Outlet } from 'react-router';
import { Toaster } from 'sonner';
import Sidebar from '../components/sidebar.tsx';
import { useAuth } from '../hooks/useAuth.ts';

export default function PrivateLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <Toaster />
      <Sidebar />
      <Outlet />
    </div>
  );
}
