
import React from "react";

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
      <div className="text-center">
        <div className="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="mt-4">
          <img 
            src="/uploads/tektalentlogo.png" 
            alt="Tek Talent Africa" 
            className="h-12 w-auto mx-auto animate-pulse" 
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
