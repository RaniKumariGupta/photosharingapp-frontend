import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import RegistrationForm from './components/RegistrationForm';
import LoginModal from './components/LoginModal';
import Create from './pages/Create';
import { Toaster } from 'sonner';
import Explore from './pages/Explore';
import SinglePhoto from './pages/SinglePhoto';
import EditPost from './pages/EditPost';
import ProfilePage from './pages/ProfilePage';
import ProfileEdit from './pages/ProfileEdit';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/explore',
        element: <Explore />,
      },
      {
        path: '/photos/:photoId',
        element: <SinglePhoto />,
      },
      {
        path: '/photos/edit/:photoId',
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: '/photos/delete/:photoId',
        element: (
          <ProtectedRoute>
            <SinglePhoto />
          </ProtectedRoute>
        ),
      },

      {
        path: '/create',
        element: (
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/editprofile',
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },

      {
        path: 'register',
        element: <RegistrationForm />,
      },
      {
        path: 'login',
        element: <LoginModal />,
      },
    ],
  },
]);

const App: React.FC = () => {
  // return <RouterProvider router={router} />;
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </ModalProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
