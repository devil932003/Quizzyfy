
// Displays the final quiz results, score, and a review of the answers.
const ResultsScreen = ({
  score,
  totalQuestions,
  questions,
  userAnswers,
  onRestart
}) => {
  // Get high score from localStorage, defaulting to 0 if it doesn't exist.
  const highScore = localStorage.getItem('quizHighScore') || 0;
  // Check if the user achieved a new high score to show a special message.
  const isNewHighScore = score > highScore && score > 0;

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">
        Quiz Completed!
      </h2>

      <p className="text-xl text-slate-300 mb-6">
        You scored <span className="text-sky-400 font-bold">{score}</span> out of {totalQuestions}
      </p>

      {/* Conditionally render the "New High Score" banner. */}
      {isNewHighScore && (
        <div
          className="bg-amber-500/20 text-amber-300 p-3 rounded-lg mb-6 animate-pulse"
          role="alert" // Important for accessibility screen readers.
        >
          New High Score! ✨
        </div>
      )}

      {/* This container will scroll if the content overflows. */}
      <div className="my-8 text-left max-h-96 overflow-y-auto pr-2">
        <h3 className="text-2xl font-semibold mb-4">
          Review Your Answers
        </h3>

        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <div key={index} className="bg-slate-700 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">
                {index + 1}. {question.question}
              </p>

              <p className={`p-2 rounded ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {/* Handle cases where a question was not answered (e.g., time ran out). */}
                Your answer: {userAnswer || "Not answered"}
              </p>

              {!isCorrect && (
                <p className="p-2 mt-1 rounded bg-slate-600/50 text-slate-300">
                  Correct answer: {question.correctAnswer}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="w-full max-w-xs bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform active:scale-95 hover:scale-105"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default ResultsScreen;