import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { postSchema, PostData } from '../schema/zodSchema';
import logo from '../assets/rmlogoo.png';

const Create = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: PostData) => {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      formData.append('caption', data.caption);

      const response = await fetch('http://localhost:3000/photos/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Upload failed');
      }
    },
    onSuccess: () => {
      toast.success('Photo uploaded successfully!');
      navigate('/');
    },
    onError: () => {
      toast.error('An error occurred');
    },
  });

  const submitData = (data: PostData) => {
    mutation.mutate(data);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValue('image', selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-6 md:p-12 rounded-lg shadow-lg mx-auto my-10 max-w-4xl">
      <div className="md:flex-1 p-6 bg-white rounded-lg shadow-lg m-4">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Photomania" className="h-12 mr-4" />
        </div>
        <form onSubmit={handleSubmit(submitData)} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2">
              Caption
            </label>
            <textarea
              {...register('caption')}
              className="border border-gray-300 rounded-lg p-4 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter caption here..."
            ></textarea>
            {errors.caption && (
              <p className="text-red-500 text-sm mt-2">
                {errors.caption.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#DAE4FF] text-black rounded-lg py-3 text-lg font-semibold hover:bg-[#8faaf3] transition duration-300"
          >
            Upload
          </button>
        </form>
      </div>
      <div className="md:flex-1 p-6 flex items-center justify-center bg-gray-50 rounded-lg shadow-lg m-4">
        <label className="cursor-pointer flex flex-col items-center justify-center bg-white p-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 shadow-md">
          <FaCloudUploadAlt className="text-6xl text-[#6c8fef] mb-4" />
          <span className="text-gray-700 font-medium text-lg">
            Click to upload image
          </span>
          <input
            type="file"
            {...register('image')}
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
          )}
        </label>
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
