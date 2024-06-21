import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPhotoById, Photo } from '../query/api';
import Loader from '../components/Loader';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { photoSchema, PhotoFormValues } from '../validations/photoSchema';
import { FaCloudUploadAlt } from 'react-icons/fa';

const EditPost: React.FC = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<Photo, Error>({
    queryKey: ['photo', photoId],
    queryFn: () => fetchPhotoById(photoId as string),
    enabled: !!photoId,
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `http://localhost:3000/photos/edit/${photoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error('Failed to update!');
        throw new Error('Failed to edit photo');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Photo updated successfully');
      navigate(`/explore`);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error('An error occurred while updating the photo');
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
  });

  useEffect(() => {
    if (data) {
      console.log('Data URL:', data.url);
      setValue('caption', data.caption);

      if (data.url) {
        const baseUrl = 'http://localhost:3000';
        const fullUrl = `${baseUrl}${data.url}`;
        console.log('Full Image URL:', fullUrl);
        setImagePreview(fullUrl);
      }
    }
  }, [data, setValue]);

  const watchImage = watch('image');

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmit = (formData: PhotoFormValues) => {
    const photoData = new FormData();
    photoData.append('caption', formData.caption);

    if (formData.image && formData.image.length > 0) {
      photoData.append('image', formData.image[0]);
    }

    mutation.mutate(photoData);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </div>

        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Edit Photo</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="caption"
              >
                Caption
              </label>
              <textarea
                id="caption"
                {...register('caption')}
                maxLength={150}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter caption (max 150 characters)"
              />
              {errors.caption && (
                <p className="text-[#7D3C98] text-xs">
                  {errors.caption.message}
                </p>
              )}
              {/* <p className="text-gray-500 text-xs italic">
                {`${watch('caption')?.split(' ').length || 0}/10 words`}
              </p> */}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                {...register('image')}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="inline-flex items-center px-4 py-2 bg-[#AF7AC5] text-[#7D3C98]border border-gray-300 rounded-full cursor-pointer hover:bg-[#7D3C98]"
              >
                <FaCloudUploadAlt className="mr-2" size={24} />
                <span>Upload</span>
              </label>
              {errors.image && (
                <p className="text-[#7D3C98] text-xs">{errors.image.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#AF7AC5] text-white px-6 py-2 rounded hover:bg-[#7D3C98] focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
