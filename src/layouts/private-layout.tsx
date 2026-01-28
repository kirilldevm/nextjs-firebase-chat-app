import { Navigate, Outlet } from 'react-router';
import { Toaster } from 'sonner';
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
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
}
