import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsScreen from '../components/ResultsScreen';

const ResultsPage = ({ quizState, score, questions, userAnswers, onRestart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (quizState !== 'results') {
      navigate('/');
    }
  }, [quizState, navigate]);
  
  // Clear all timer data when results page loads
  useEffect(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('quizTimer_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);
  
  if (quizState !== 'results' || !questions || questions.length === 0) {
    return null;
  }

  return (
    <ResultsScreen
      score={score}
      totalQuestions={questions.length}
      questions={questions}
      userAnswers={userAnswers}
      onRestart={onRestart}
    />
  );
};

export default ResultsPage;