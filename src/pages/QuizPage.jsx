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

  useEffect(() => {
    if (quizState === 'start' && !localStorage.getItem('quizProgress')) {
      navigate('/');
    } 
    else if (quizState === 'results') {
      navigate('/results');
    }
  }, [quizState, navigate]);

  const renderQuizContent = () => {
    switch (quizState) {
      case 'loading':
        return <LoadingSpinner />;
      
      case 'ongoing':
        if (!questions || questions.length === 0) {
          return <LoadingSpinner />;
        }
        
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
      
      default:
        return <LoadingSpinner />;
    }
  };

  return renderQuizContent();
};

export default QuizPage;