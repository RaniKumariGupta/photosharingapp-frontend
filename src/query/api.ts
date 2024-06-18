export interface User {
    id: number;
    firstName:string;
    lastName: string;
  }
  
  export interface Photo {
    id: number;
    url: string;
    title: string;
    user: User;

  }
  export interface PhotoResponse {
    photos: Photo[];
    nextPage: number | null;
    total: number;
    keepPreviousData: boolean;
  }
  
//  const fetchPhotos = async (): Promise<Photo[]> => {
//     // const response = await fetch('http://localhost:3000/photos/explore?');
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   };

const fetchPhotos = async (page: number = 1, limit: number = 10): Promise<PhotoResponse> => {
    console.log(`Fetching photos from backend for page ${page} with limit ${limit}`);
    const response = await fetch(`http://localhost:3000/photos/explore?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: PhotoResponse = await response.json();
    console.log('Data received from server:', data);
    return data;
  };
  
  export { fetchPhotos };
  