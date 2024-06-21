import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '../context/ModalContext';
import { toast } from 'sonner';
// import logo from '../assets/rmlogoo.png';

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(12),
});

type RegistrationData = z.infer<typeof registrationSchema>;

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { isRegisterModalOpen, closeRegisterModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Registration successfull Please log in.');
      navigate('/explore');
      closeRegisterModal();
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const onSubmit: SubmitHandler<RegistrationData> = (data) => {
    mutate(data);
  };

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Register</h2>
          {/* <img src={logo} alt="Photomania" className="w-24 mr-4" /> */}
          <button onClick={closeRegisterModal} className="text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              {...register('firstName')}
              className="border rounded p-2 w-full"
            />
            {errors.firstName && (
              <p className="text-[#7D3C98] text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              {...register('lastName')}
              className="border rounded p-2 w-full"
            />
            {errors.lastName && (
              <p className="text-[#7D3C98] text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
