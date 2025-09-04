

// The initial screen of the quiz app where users can start the game and select a difficulty level.
const StartScreen = ({ onStart, difficulty, setDifficulty }) => {
  // Get the existing high score from localStorage, or default to 0 if not found.
  const highScore = localStorage.getItem('quizHighScore') || 0;
  
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-semibold mb-4">
        Welcome to the Quiz!
      </h2>
      
      <p className="text-slate-300 mb-6">
        You'll face 10 questions with a 30-second timer for each.
      </p>
      
      {/* Conditionally displays the high score only if one has been set. */}
      {highScore > 0 && (
        <p 
          className="text-lg text-amber-400 mb-6" 
          aria-label={`High score is ${highScore} out of 10`}
        >
          High Score: {highScore} / 10
        </p>
      )}

      <div className="mb-8">
        <label 
          htmlFor="difficulty" 
          className="block text-lg mb-2"
        >
          Select Difficulty:
        </label>
        
        {/* The dropdown's value and onChange handler are managed by the parent App component. */}
        <select 
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-slate-700 text-white p-3 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          aria-label="Select quiz difficulty"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <button
        onClick={onStart}
        className="w-full max-w-xs bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform active:scale-95 hover:scale-105"
        aria-label="Start the quiz"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default StartScreen;