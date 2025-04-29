
import React from 'react';

interface PageLoaderProps {
  isLoading?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24">
          <div className="absolute h-full w-full border-4 border-t-tekOrange border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute h-full w-full border-4 border-t-transparent border-r-transparent border-b-tekOrange border-l-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
        <div className="mt-4 text-tekOrange font-medium animate-pulse">Loading...</div>
      </div>
    </div>
  );
};

export default PageLoader;
