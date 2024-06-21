import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../query/profileApi';
import { User, Photo, getUserPhotos } from '../query/api';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

const ProfilePage: React.FC = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const navigate = useNavigate();

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const {
    data: photos,
    error: photosError,
    isLoading: photosLoading,
  } = useQuery<Photo[]>({
    queryKey: ['userPhotos'],
    queryFn: getUserPhotos,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show the button when the user has scrolled down 100 pixels from the top
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (userLoading || photosLoading) return <Loader />;
  if (userError || photosError)
    return (
      <div className="text-center text-[#7D3C98]">
        Error: {userError?.message || photosError?.message}
      </div>
    );

  const baseUrl = 'http://localhost:3000';
  const profileImageUrl = user?.profileImage
    ? `${baseUrl}${user.profileImage}`
    : '/moon.png';

  const handleEditProfile = () => {
    navigate('/editProfile');
  };

  const handleUploadPhoto = () => {
    navigate('/Create');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-6">
        {user?.profileImage ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="h-40 w-40 object-cover rounded-full border-4 border-[#7D3C98]"
            // onError={(e) => {
            //   console.error('Image load error:', e);
            //   (e.target as HTMLImageElement).src = `default-moon.png`;
            // }}
          />
        ) : (
          <div className="h-40 w-40 bg-[#7D3C98] rounded-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600 mb-4">{user?.email}</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className="px-4 py-2 bg-[#AF7AC5] text-white rounded hover:bg-[#7D3C98]"
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
        <button
          className="px-4 py-2 bg-[#AF7AC5] text-white rounded hover:bg-[#7D3C98]"
          onClick={handleUploadPhoto}
        >
          Create
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Your Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos?.map((photo) => (
            <div key={photo.id} className="border p-2 rounded bg-white shadow">
              <img
                src={`${baseUrl}${photo.url}`}
                alt={photo.caption}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-photo.png';
                }}
              />
              <p className="mt-2 text-center">{photo.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {showScrollToTop && (
        <button
          className="fixed bottom-8 right-8 p-3 bg-[#AF7AC5] text-white rounded-full shadow-lg hover:bg-[#7D3C98] transition duration-200"
          onClick={scrollToTop}
        >
          <FaArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
