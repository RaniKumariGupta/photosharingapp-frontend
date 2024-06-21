import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postSchema, PostData } from '../schema/zodSchema';

const Create: React.FC = () => {
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

  const { mutate, isLoading } = useMutation({
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
      navigate('/explore');
    },
    onError: () => {
      toast.error('An error occurred');
    },
  });

  const submitData = (data: PostData) => {
    mutate(data);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Create New Photo</h2>
        <form onSubmit={handleSubmit(submitData)}>
          <div className="mb-4">
            <label className="block text-gray-700">Caption</label>
            <input
              type="text"
              {...register('caption')}
              maxLength={150}
              className="w-full p-2 border rounded"
              placeholder="Enter caption (max 150 characters)"
            />
            {errors.caption && (
              <p className="text-[#7D3C98]">{errors.caption.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.image && (
              <p className="text-[#7D3C98]">{errors.image.message}</p>
            )}
          </div>
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-[#AF7AC5] text-white rounded hover:bg-[#7D3C98] disabled:bg-gray-400"
          >
            {isLoading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
