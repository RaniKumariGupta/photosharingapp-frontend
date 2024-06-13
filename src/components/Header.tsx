import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import logo from '../assets/Photomania (2).png';
import { useModal } from '../context/ModalContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openLoginModal } = useModal();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-[#8faaf3] text-white'
      : 'hover:bg-[#DAE4FF] hover:text-black';
  };
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const token = localStorage.getItem('token');

  return (
    <header className="bg-[#F4F6F7] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 text-2xl font-bold">
          <Link to="/">
            {/* <img src={logo} alt="Photomania Logo" className="h-10 w-10" /> */}
            Photomania
          </Link>
        </div>

        <nav className="flex flex-1 justify-between items-center ml-8">
          <div className="flex space-x-4 ">
            <Link
              to="/explore"
              className={`${isActive('/explore')} rounded p-2 transition duration-300`}
            >
              Explore
            </Link>
            <Link
              to="/create"
              className={`${isActive('/create')} rounded p-2 transition duration-300`}
            >
              Create
            </Link>
          </div>
          <div className="flex space-x-4">
            {token && (
              <Link
                to="/profile"
                className={`${isActive('/profile')} rounded p-2 transition duration-300`}
              >
                Profile
              </Link>
            )}
            {token ? (
              <button
                onClick={logout}
                className="rounded p-2 transition duration-300 bg-[#DAE4FF] hover:bg-[#8faaf3]"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="rounded p-2 transition duration-300 bg-[#DAE4FF] hover:bg-[#8faaf3]"
              >
                Login
              </button>
            )}
            <Link
              to="/register"
              className={`${isActive('/register')} rounded p-2 transition duration-300`}
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
