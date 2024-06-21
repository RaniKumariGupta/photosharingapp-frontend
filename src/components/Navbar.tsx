import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/rmphotomina.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, setToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { openLoginModal, openRegisterModal } = useModal();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-[#7D3C98] text-white'
      : 'hover:bg-[#AF7AC5]';
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/explore');
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [setToken]);

  return (
    <header className="bg-[#AF7AC5] text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Photomania" className="w-24 mr-4" />
        </div>
        <nav className="hidden md:flex justify-between flex-1">
          <div className="flex space-x-6">
            <Link
              to="/explore"
              className={`${isActive('/explore')} rounded p-2`}
            >
              Explore
            </Link>
            {/* <Link to="/create" className={`${isActive('/create')} rounded p-2`}>
              Create
            </Link> */}
          </div>
          <div className="flex space-x-6">
            {token && (
              <Link
                to="/create"
                className={`${isActive('/create')} rounded p-2`}
              >
                Create
              </Link>
            )}
            {token && (
              <Link
                to="/profile"
                className={`${isActive('/profile')} rounded p-2`}
              >
                Profile
              </Link>
            )}
            {token ? (
              <button
                onClick={logout}
                className="rounded p-2 bg-[#7D3C98] hover:bg-[#AF7AC5]"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className={`${isActive('/login')} rounded p-2`}
                >
                  Login
                </button>
                <button
                  onClick={openRegisterModal}
                  className={`${isActive('/register')} rounded p-2`}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <FaBars size={24} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#AF7AC5]">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/explore"
              className={`block ${isActive('/explore')} rounded p-2`}
              onClick={toggleMenu}
            >
              Explore
            </Link>
            <Link
              to="/create"
              className={`block ${isActive('/create')} rounded p-2`}
              onClick={toggleMenu}
            >
              Create
            </Link>
            {token && (
              <Link
                to="/profile"
                className={`block ${isActive('/profile')} rounded p-2`}
                onClick={toggleMenu}
              >
                Profile
              </Link>
            )}
            {token ? (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="block rounded p-2 bg-[#7D3C98] hover:bg-[#AF7AC5]"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    openLoginModal();
                    toggleMenu();
                  }}
                  className="block rounded p-2 bg-[#AF7AC5] hover:bg-[#7D3C98]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openRegisterModal();
                    toggleMenu();
                  }}
                  className="block rounded p-2 bg-[#AF7AC5] hover:bg-[#7D3C98]"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
