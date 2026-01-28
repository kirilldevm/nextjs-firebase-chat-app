import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App.tsx';
import './index.css';
import PrivateLayout from './layouts/private-layout.tsx';
import PublicLayout from './layouts/public-layout.tsx';

const MainChatPage = lazy(() => import('./pages/main-chat.tsx'));

const LoginPage = lazy(() => import('./pages/login.tsx'));
const RegisterPage = lazy(() => import('./pages/register.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: '/chat/:id',
        element: <MainChatPage />,
      },
    ],
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex font-bold text-2xl justify-center items-center h-screen">
        404
      </div>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
