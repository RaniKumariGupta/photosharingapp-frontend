import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7D3C98]"></div>
    </div>
  );
};

export default Loader;
