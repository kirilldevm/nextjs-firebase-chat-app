import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export default function PublicLayout() {
  return (
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
}
