import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import { decodeHtml } from './utils/helpers';

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

const App = () => {
  const getInitialState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [quizState, setQuizState] = useState(() => 
    getInitialState('quizProgress', {}).quizState || 'start'
  );
  
  const [questions, setQuestions] = useState(() => 
    getInitialState('quizProgress', {}).questions || []
  );
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => 
    getInitialState('quizProgress', {}).currentQuestionIndex || 0
  );
  
  const [userAnswers, setUserAnswers] = useState(() => 
    getInitialState('quizProgress', {}).userAnswers || {}
  );
  
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quizState !== 'start' && quizState !== 'results') {
      const progress = { quizState, questions, currentQuestionIndex, userAnswers };
      localStorage.setItem('quizProgress', JSON.stringify(progress));
    } else if (quizState === 'results') {
      localStorage.removeItem('quizProgress');
    }
  }, [quizState, questions, currentQuestionIndex, userAnswers]);

  const fetchQuestions = useCallback(async () => {
    setQuizState('loading');
    navigate('/quiz');
    setError(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok. Please check your connection.');
      }
      
      const data = await response.json();
      
      if (data.results.length === 0) {
        throw new Error('No questions found for the selected difficulty. Please try another level.');
      }
      
      // Process and format questions
      const formattedQuestions = data.results.map((q) => ({
        question: decodeHtml(q.question),
        correctAnswer: decodeHtml(q.correct_answer),
        // Mix correct and incorrect answers and shuffle them
        options: [...q.incorrect_answers.map(decodeHtml), decodeHtml(q.correct_answer)]
          .sort(() => Math.random() - 0.5),
      }));
      
      setQuestions(formattedQuestions);
      setQuizState('ongoing');
    } catch (err) {
      setError(err.message || 'Failed to fetch questions. Please try again.');
      setQuizState('error');
    }
  }, [difficulty, navigate]);

  const calculateScore = useCallback(() => {
    let finalScore = questions.reduce((acc, question, index) => 
      userAnswers[index] === question.correctAnswer ? acc + 1 : acc, 0
    );
    
    setScore(finalScore);
    
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (finalScore > highScore) {
      localStorage.setItem('quizHighScore', finalScore);
    }
  }, [questions, userAnswers]);

  const handleAnswerSelect = (answer) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      calculateScore();
      setQuizState('results');
      navigate('/results');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const restartQuiz = () => {
    setQuizState('start');
    localStorage.removeItem('quizProgress');
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('quizTimer_')) {
        localStorage.removeItem(key);
      }
    });
    navigate('/');
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-between font-sans p-4 font-inter">
      <div className="w-full max-w-2xl mx-auto flex-1">
        <Header />
        <main className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 mt-6">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  difficulty={difficulty} 
                  setDifficulty={setDifficulty} 
                  onStart={fetchQuestions} 
                />
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <QuizPage 
                  quizState={quizState}
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  userAnswers={userAnswers}
                  error={error}
                  handleAnswerSelect={handleAnswerSelect}
                  handleNextQuestion={handleNextQuestion}
                  handlePreviousQuestion={handlePreviousQuestion}
                  onRetry={fetchQuestions}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                <ResultsPage 
                  quizState={quizState} 
                  score={score} 
                  questions={questions} 
                  userAnswers={userAnswers} 
                  onRestart={restartQuiz} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
      <footer className="text-slate-500 text-sm mt-6 mb-2">
        Made with ❤️ by Devansh Mishra
      </footer>
    </div>
  );
};

export default AppWrapper;