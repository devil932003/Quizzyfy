
const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div 
      className="text-center text-red-400 animate-fade-in" 
      role="alert"
    >
      <h2 className="text-2xl font-semibold mb-4">
        Oops! Something went wrong.
      </h2>
      
      <p className="bg-red-500/20 p-4 rounded-lg mb-6">
        {message}
      </p>
      
      <button
        onClick={onRetry}
        className="w-full max-w-xs bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform active:scale-95 hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;