import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export default function PrivateLayout() {
  return (
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
}
