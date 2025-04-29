
import React from 'react';

interface PageLoaderProps {
  isLoading?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <div className="h-24 w-24 relative">
          {/* Outer spinning circle */}
          <div className="absolute h-full w-full border-4 border-t-tekOrange border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
          
          {/* Middle spinning circle (opposite direction) */}
          <div className="absolute h-3/4 w-3/4 top-1/8 left-1/8 border-4 border-t-transparent border-r-tekOrange/70 border-b-transparent border-l-transparent rounded-full animate-spin-slow animation-reverse" style={{top: '12.5%', left: '12.5%'}}></div>
          
          {/* Inner spinning dot */}
          <div className="absolute h-1/2 w-1/2 top-1/4 left-1/4 flex items-center justify-center">
            <div className="h-3 w-3 bg-tekOrange rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
