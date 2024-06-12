// // src/components/Header.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Header: React.FC = () => {
//   return (
//     <header className="bg-gray-800 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-2xl font-bold">
//           <Link to="/">Photomania</Link>
//         </div>

//         <nav className="flex flex-1 justify-between items-center">
//           <div className="flex space-x-4 ">
//             <Link to="/explore" className="hover:text-gray-400 rounded">
//               Explore
//             </Link>
//             <Link to="/create" className="hover:text-gray-400">
//               Create
//             </Link>
//           </div>
//           <div className="flex space-x-4">
//             <Link to="/profile" className="hover:text-gray-400">
//               Profile
//             </Link>
//             <Link to="/register" className="hover:text-gray-400">
//               Register
//             </Link>
//             <Link to="/login" className="hover:text-gray-400">
//               Login
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Photomania (2).png';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-[#8faaf3] text-white'
      : 'hover:bg-[#DAE4FF] hover:text-black';
  };

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
            <Link
              to="/profile"
              className={`${isActive('/profile')} rounded p-2 transition duration-300`}
            >
              Profile
            </Link>
            <Link
              to="/register"
              className={`${isActive('/register')} rounded p-2 transition duration-300`}
            >
              Register
            </Link>
            <Link
              to="/login"
              className={`${isActive('/login')} rounded p-2 transition duration-300`}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
