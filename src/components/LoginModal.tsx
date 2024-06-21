// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useModal } from '../context/ModalContext';
// import { toast } from 'sonner';
// import logo from '../assets/rmlogoo.png';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z
//     .string()
//     .min(6, 'Password must be at least 6 characters long')
//     .max(12),
// });

// type LoginData = z.infer<typeof loginSchema>;

// const LoginModal: React.FC = () => {
//   const navigate = useNavigate();
//   const { isLoginModalOpen, closeLoginModal } = useModal();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const { mutate } = useMutation({
//     mutationFn: async (data: LoginData) => {
//       const response = await fetch('http://localhost:3000/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//       }
//       return response.json();
//     },
//     onSuccess: (data) => {
//       localStorage.setItem('token', data.token);
//       toast.success('Login successful!');
//       navigate('/profile');
//       closeLoginModal();
//     },
//     onError: (error) => {
//       console.error(error);
//       if (error instanceof Error) {
//         setError('root.serverError', { message: error.message });
//       }
//       toast.error(error.message || 'Login failed');
//     },
//   });

//   const onSubmit = (data: LoginData) => {
//     mutate(data);
//   };

//   if (!isLoginModalOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Login</h2>
//           <img src={logo} alt="Photomania" className="w-24 mr-4" />
//           <button onClick={closeLoginModal} className="text-gray-700">
//             &times;
//           </button>
//         </div>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {errors.root?.serverError && (
//             <div className="bg-red-100 text-red-700 p-2 rounded-md">
//               {errors.root.serverError.message}
//             </div>
//           )}
//           <div>
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               {...register('email')}
//               className="border rounded p-2 w-full"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               {...register('password')}
//               className="border rounded p-2 w-full"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-[#DAE4FF] text-black rounded py-2 hover:bg-[#8faaf3] transition duration-200"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

// src/components/LoginModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
// import logo from '../assets/rmlogoo.png';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(12),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal } = useModal();
  const { setToken } = useAuth(); // Use setToken

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setToken(data.token); // Update token state
      toast.success('Login successful!');
      navigate('/profile');
      closeLoginModal();
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof Error) {
        setError('root.serverError', { message: error.message });
      }
      toast.error(error.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginData) => {
    mutate(data);
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          {/* <img src={logo} alt="Photomania" className="w-24 mr-4" /> */}
          <button onClick={closeLoginModal} className="text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root?.serverError && (
            <div className="bg-red-100 text-[#7D3C98] p-2 rounded-md">
              {errors.root.serverError.message}
            </div>
          )}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="border rounded p-2 w-full"
            />
            {errors.email && (
              <p className="text-[#7D3C98] text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className="border rounded p-2 w-full"
            />
            {errors.password && (
              <p className="text-[#7D3C98] text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#AF7AC5] text-black rounded py-2 hover:bg-[#7D3C98] transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
