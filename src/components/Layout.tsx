import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegistrationForm from './RegistrationForm';

const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
        <LoginModal />
        <RegistrationForm />
      </main>
    </div>
  );
};

export default Layout;
