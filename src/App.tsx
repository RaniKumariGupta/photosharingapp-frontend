// import React from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import RegisterForm from './components/RegistrationForm';
// import Header from './components/Header';
// import { ModalProvider } from './context/ModalContext';
// import LoginModal from './components/LoginModal';
// import { Toaster } from 'sonner';
// import Create from './components/Create';

// const queryClient = new QueryClient();

// const App: React.FC = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <ModalProvider>
//         <Router>
//           <Header />
//           <Routes>
//             <Route path="/register" element={<RegisterForm />} />

//             <Route path="/login" element={<LoginModal />} />
//             <Route path="/create" element={<Create />} />
//           </Routes>
//           <LoginModal />
//           <Toaster position="top-right" />
//         </Router>
//       </ModalProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;

///////////////////////////////////////////////////////////////////////////

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

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Explore />,
      },
      {
        path: 'create',
        element: <Create />,
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
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default App;
