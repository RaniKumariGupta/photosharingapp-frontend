export interface User {
    id: number;
    firstName:string;
    lastName: string;
    email: string;
    profileImage?: string;
  }
  
  export interface Photo {
    id: number;
    url: string;
    title: string;
    caption: string;
    user: User;
    image: FileList;
  }
  export interface PhotoResponse {
    photos: Photo[];
    nextPage: number | null;
    total: number;
   
  }

const fetchPhotos = async (page: number = 1, limit: number= 12 ): Promise<PhotoResponse> => {
    // console.log(`Fetching photos from backend for page ${page} with limit ${limit}`);
    const response = await fetch(`http://localhost:3000/photos/explore?page=${page}&limit=${limit}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: PhotoResponse = await response.json();
    console.log('Data received from server:', data);
    return data;
    
  };

export const fetchPhotoById = async (photoId: string): Promise<Photo> => {
  try {
    const response = await fetch(`http://localhost:3000/photos/${photoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch photo: ${errorData.message}`);
    }

    const data: Photo = await response.json();
    console.log('Data received from server:', data);
    return data;
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw error;
  }
};


  export const deletePhotoById = async (photoId: string) => {
    const response = await fetch(`http://localhost:3000/photos/delete/${photoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  
    return response.json();
  };


  export const getUserPhotos = async (): Promise<Photo[]> => {
    const response = await fetch('http://localhost:3000/photos/user-photos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user photos');
    }
  
    const data = await response.json();
    return data.photos;
  };

export { fetchPhotos };
  