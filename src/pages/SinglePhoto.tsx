import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPhotoById, deletePhotoById, Photo } from '../query/api';
import Loader from '../components/Loader';
import Modal from '../components/DeleteModal';

import { toast } from 'sonner';

const SinglePhoto: React.FC = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<Photo, Error>({
    queryKey: ['photo', photoId],
    queryFn: () => fetchPhotoById(photoId as string),
    enabled: !!photoId,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    console.log('Edit photo:', photoId);
    navigate(`/photos/edit/${photoId}`);
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePhotoById(photoId as string);
      toast.success('Photo deleted successfully');
      navigate('/explore');
    } catch (err) {
      console.error('Failed to delete photo:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  console.log('===========');
  console.log('Token:', localStorage.getItem('token'));
  console.log('===========');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <img
                src={`http://localhost:3000${data.url}`}
                alt={data.caption}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 p-4 flex flex-col justify-between">
              <div>
                {/* <h2 className="text-2xl font-semibold mb-2">{data.title}</h2> */}
                <p className="text-gray-600 mb-2 italic">
                  By {data.user.firstName} {data.user.lastName}
                </p>
                <p className="text-gray-800 mb-4">{data.caption}</p>
              </div>
              {localStorage.getItem('token') != null ? (
                <div className="flex mt-4">
                  <button
                    onClick={handleEdit}
                    className="bg-[#AF7AC5] text-white px-4 py-2 rounded hover:bg-[#7D3C98]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-[#AF7AC5] text-white px-4 py-2 ml-3 rounded hover:bg-[#7D3C98]"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this photo?</p>
      </Modal>
    </div>
  );
};
export default SinglePhoto;
