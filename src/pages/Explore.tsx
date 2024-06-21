import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchPhotos, PhotoResponse } from '../query/api';
import Loader from '../components/Loader';

const Explore: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<PhotoResponse, Error>({
    queryKey: ['photos', page],
    queryFn: () => fetchPhotos(page, 12),
  });

  console.log('Data fetched:', data);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  const handlePhotoClick = (photoId: number) => {
    navigate(`/photos/${photoId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#AF7AC5]">Explore Photos</h1>
        <p className="text-lg text-gray-500 mt-2">
          Discover beautiful moments captured by our community.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.photos.map((photo) => (
          <div
            key={photo.id}
            className="border rounded-lg shadow-lg overflow-hidden"
            onClick={() => handlePhotoClick(photo.id)}
          >
            <img
              src={`http://localhost:3000${photo.url}`}
              alt={photo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{photo.title}</h2>
              <p className="text-gray-600">
                By {photo.user.firstName + ' ' + photo.user.lastName}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-[#AF7AC5] text-white px-4 py-2 rounded hover:bg-[#7D3C98] disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => (data?.nextPage ? prev + 1 : prev))}
          disabled={!data?.nextPage}
          className="bg-[#AF7AC5] text-white px-4 py-2 rounded hover:bg-[#7D3C98] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Explore;
