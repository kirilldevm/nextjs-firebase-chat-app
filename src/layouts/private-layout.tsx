import { Outlet } from 'react-router';

export default function PrivateLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
