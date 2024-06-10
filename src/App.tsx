//  import { useQuery } from '@tanstack/react-query';
// import './App.css';

// function App() {
//   const { isLoading, error, data } = useQuery({
//     queryKey: ['movies'],
//     queryFn: ({ signal }) =>
//       fetch('http://localhost:3000/photos/upload', options).then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch');
//         }
//         return response.json();
//       }),
//   });

//   if (isLoading) return 'Loading...';

//   if (error) return 'An error has occurred: ' + error.message;
//   return (
//     <>
//       <h1 className="text-3xl font-bold underline">Hello world!</h1>
//     </>
//   );
// }

// export default App;

import { useQuery } from '@tanstack/react-query';
import './App.css';

const fetchMovies = async ({ signal }: { signal: AbortSignal }) => {
  const response = await fetch('http://localhost:5000/photos/explore');
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

function App() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return <div>An error has occurred: {(error as Error).message}</div>;

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {/* Render your data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default App;
