import React, { useState, useEffect } from 'react';

const QuestionCard = ({
  questionData,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(`quizTimer_${questionNumber}`);
    return saved ? parseInt(saved, 10) : 30;
  });

  useEffect(() => {
    const saved = localStorage.getItem(`quizTimer_${questionNumber}`);
    setTimeLeft(saved ? parseInt(saved, 10) : 30);
  }, [questionNumber]);

  useEffect(() => {
    if (selectedAnswer || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        localStorage.setItem(`quizTimer_${questionNumber}`, newTime.toString());

        if (newTime <= 0) {
          clearInterval(timerId);
          onAnswerSelect("Time's Up"); 
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedAnswer, questionNumber, timeLeft, onAnswerSelect]);

  useEffect(() => {
    if (selectedAnswer) {
      localStorage.removeItem(`quizTimer_${questionNumber}`);
    }
  }, [selectedAnswer, questionNumber]);

  const getButtonStyle = (option) => {
    if (!selectedAnswer) {
      return "bg-slate-700 hover:bg-sky-700 focus:ring-sky-500";
    }
    if (option === questionData.correctAnswer) {
      return "bg-green-600 cursor-not-allowed";
    }
    if (option === selectedAnswer) {
      return "bg-red-600 cursor-not-allowed";
    }
    return "bg-slate-700 opacity-50 cursor-not-allowed";
  };

  return (
    <div className="animate-fade-in-fast">
      <div className="flex justify-between items-center mb-4 text-slate-400">
        <span className="text-sm">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div
          className={`text-lg font-bold p-2 rounded-full ${
            timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-300'
          }`}
        >
          Time: {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full bg-slate-700 rounded-full h-2.5 mb-6"
        role="progressbar"
        aria-valuenow={questionNumber}
        aria-valuemin="1"
        aria-valuemax={totalQuestions}
      >
        <div
          className="bg-sky-500 h-2.5 rounded-full"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">{questionData.question}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(option)}
            disabled={!!selectedAnswer}
            className={`w-full p-4 rounded-lg text-left transition-all duration-200 text-white font-medium ${getButtonStyle(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrevious}
          disabled={questionNumber === 1}
          className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {questionNumber === totalQuestions ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
