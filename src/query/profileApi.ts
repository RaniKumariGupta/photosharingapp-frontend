const baseUrl = 'http://localhost:3000';

export const fetchUserProfile = async () => {
  const response = await fetch(`${baseUrl}/users/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

export const updateUserProfile = async (profileData: FormData) => {
  const response = await fetch(`${baseUrl}/users/profile/edit`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: profileData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }

  return response.json();
};
