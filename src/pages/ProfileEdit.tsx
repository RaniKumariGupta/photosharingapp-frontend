import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { profileSchema, ProfileFormValues } from '../schema/zodSchema';
import { fetchUserProfile, updateUserProfile } from '../query/profileApi';
import Loader from '../components/Loader';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      navigate('/profile');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
      if (user.profileImage) {
        setImagePreview(`http://localhost:3000${user.profileImage}`);
      }
    }
  }, [user, setValue]);

  const onSubmit = (data: ProfileFormValues) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    if (data.profileImage && data.profileImage[0]) {
      formData.append('profileImage', data.profileImage[0]);
    }

    mutation.mutate(formData);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImage', e.target.files);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-[#7D3C98]">Error: {error.message}</div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-[#7D3C98] text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-[#7D3C98] text-xs">{errors.lastName.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            {...register('email')}
            disabled
          />
          {errors.email && (
            <p className="text-[#7D3C98] text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profileImage"
          >
            Profile Image
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md"
            onChange={handleFileInputChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mt-4 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#AF7AC5] text-white py-2 px-4 rounded hover:bg-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#7D3C98]focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { profileSchema, ProfileFormValues } from '../schema/zodSchema';
// import { fetchUserProfile, updateUserProfile } from '../query/profileApi';
// import Loader from '../components/Loader';
// import { useAuth } from '../context/AuthContext';

// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profileImage?: string;
// }

// const ProfileEdit: React.FC = () => {
//   const navigate = useNavigate();
//   const { token } = useAuth(); // Use token from AuthContext

//   const {
//     data: user,
//     error,
//     isLoading,
//   } = useQuery<User>({
//     queryKey: ['userProfile'],
//     queryFn: fetchUserProfile,
//     enabled: !!token, // Only run the query if token is available
//   });

//   const mutation = useMutation({
//     mutationFn: updateUserProfile,
//     onSuccess: () => {
//       toast.success('Profile updated successfully');
//       navigate('/profile');
//     },
//     onError: (error) => {
//       toast.error(`Error: ${error.message}`);
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   useEffect(() => {
//     if (user) {
//       setValue('firstName', user.firstName);
//       setValue('lastName', user.lastName);
//       setValue('email', user.email);
//       if (user.profileImage) {
//         setImagePreview(`http://localhost:3000${user.profileImage}`);
//       }
//     }
//   }, [user, setValue]);

//   const onSubmit = (data: ProfileFormValues) => {
//     const formData = new FormData();
//     formData.append('firstName', data.firstName);
//     formData.append('lastName', data.lastName);
//     formData.append('email', data.email);
//     if (data.profileImage && data.profileImage[0]) {
//       formData.append('profileImage', data.profileImage[0]);
//     }

//     mutation.mutate(formData);
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setValue('profileImage', e.target.files);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (isLoading) return <Loader />;

//   if (error)
//     return (
//       <div className="text-center text-red-500">Error: {error.message}</div>
//     );

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="firstName"
//           >
//             First Name
//           </label>
//           <input
//             id="firstName"
//             type="text"
//             className="w-full px-3 py-2 border rounded-md"
//             {...register('firstName')}
//           />
//           {errors.firstName && (
//             <p className="text-red-500 text-xs italic">
//               {errors.firstName.message}
//             </p>
//           )}
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="lastName"
//           >
//             Last Name
//           </label>
//           <input
//             id="lastName"
//             type="text"
//             className="w-full px-3 py-2 border rounded-md"
//             {...register('lastName')}
//           />
//           {errors.lastName && (
//             <p className="text-red-500 text-xs italic">
//               {errors.lastName.message}
//             </p>
//           )}
//         </div>
//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             className="w-full px-3 py-2 border rounded-md"
//             {...register('email')}
//             disabled
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs italic">
//               {errors.email.message}
//             </p>
//           )}
//         </div>
//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="profileImage"
//           >
//             Profile Image
//           </label>
//           <input
//             id="profileImage"
//             type="file"
//             accept="image/*"
//             className="w-full px-3 py-2 border rounded-md"
//             onChange={handleFileInputChange}
//           />
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Image Preview"
//               className="mt-4 w-full h-48 object-cover rounded-md"
//             />
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#AF7AC5] text-white py-2 px-4 rounded hover:bg-[#7D3C98] focus:outline-none focus:ring-2 focus:ring-[#7D3C98] transition duration-200"
//         >
//           Update Profile
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfileEdit;
