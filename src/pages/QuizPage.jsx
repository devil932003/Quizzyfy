import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import QuestionCard from '../components/QuestionCard';

const QuizPage = ({
  quizState,
  questions,
  currentQuestionIndex,
  userAnswers,
  error,
  handleAnswerSelect,
  handleNextQuestion,
  handlePreviousQuestion,
  onRetry
}) => {
  const navigate = useNavigate();

  // This effect handles routing logic to protect the page.
  useEffect(() => {
    // If the quiz hasn't started and there's no saved progress, send the user back home.
    if (quizState === 'start' && !localStorage.getItem('quizProgress')) {
      navigate('/');
    } 
    // If the quiz has already finished, redirect to the results page.
    else if (quizState === 'results') {
      navigate('/results');
    }
  }, [quizState, navigate]);

  // This function decides which component to show based on the quiz's current state.
  const renderQuizContent = () => {
    switch (quizState) {
      case 'loading':
        return <LoadingSpinner />;
      
      case 'ongoing':
        // A safety check to ensure questions exist before trying to display them.
        if (!questions || questions.length === 0) {
          return <LoadingSpinner />;
        }
        
        // If everything is ready, show the current question.
        return (
          <QuestionCard
            questionData={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
          />
        );
      
      case 'error':
        return <ErrorDisplay message={error} onRetry={onRetry} />;
      
      // The default case acts as a fallback, showing a loader during initial state transitions.
      default:
        return <LoadingSpinner />;
    }
  };

  return renderQuizContent();
};

export default QuizPage;