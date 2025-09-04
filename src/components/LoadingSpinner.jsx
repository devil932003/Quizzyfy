
const LoadingSpinner = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center h-64"
    >
      <div 
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500" 
        role="status" 
        aria-label="Loading"
      >
      </div>
      
      <p className="mt-4 text-lg">
        Fetching Questions...
      </p>
    </div>
  );
};

export default LoadingSpinner;