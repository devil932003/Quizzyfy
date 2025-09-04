import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage'; 
import ResultsPage from './pages/ResultsPage';
import { decodeHtml } from './utils/helpers';

// Wrapper to provide Router context to the whole app
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

const App = () => {
  // Utility function → retrieves state from localStorage (used for persistence)
  const getInitialState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // ------------------ STATE MANAGEMENT ------------------
  const [quizState, setQuizState] = useState(() => 
    getInitialState('quizProgress', {}).quizState || 'start'
  ); // Tracks quiz state → 'start' | 'loading' | 'ongoing' | 'results' | 'error'

  const [questions, setQuestions] = useState(() => 
    getInitialState('quizProgress', {}).questions || []
  ); // Stores fetched questions

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => 
    getInitialState('quizProgress', {}).currentQuestionIndex || 0
  ); // Tracks current question index

  const [userAnswers, setUserAnswers] = useState(() => 
    getInitialState('quizProgress', {}).userAnswers || {}
  ); // Stores user's answers for each question

  const [score, setScore] = useState(0); // Tracks final score
  const [difficulty, setDifficulty] = useState('easy'); // Stores difficulty level
  const [error, setError] = useState(null); // Handles API errors
  const navigate = useNavigate();

  // ------------------ PERSIST QUIZ PROGRESS ------------------
  useEffect(() => {
    if (quizState !== 'start' && quizState !== 'results') {
      // Save quiz progress in localStorage while quiz is ongoing
      const progress = { quizState, questions, currentQuestionIndex, userAnswers };
      localStorage.setItem('quizProgress', JSON.stringify(progress));
    } else if (quizState === 'results') {
      // Clear progress once quiz ends
      localStorage.removeItem('quizProgress');
    }
  }, [quizState, questions, currentQuestionIndex, userAnswers]);

  // ------------------ FETCH QUESTIONS FROM API ------------------
  const fetchQuestions = useCallback(async () => {
    setQuizState('loading'); // Show loading state
    navigate('/quiz'); // Navigate to quiz page
    setError(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    
    try {
      // Fetch 10 MCQs from OpenTDB API based on difficulty
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
      
      // Format questions → decode HTML & shuffle options
      const formattedQuestions = data.results.map((q) => ({
        question: decodeHtml(q.question),
        correctAnswer: decodeHtml(q.correct_answer),
        options: [...q.incorrect_answers.map(decodeHtml), decodeHtml(q.correct_answer)]
          .sort(() => Math.random() - 0.5), // Randomize options
      }));
      
      setQuestions(formattedQuestions);
      setQuizState('ongoing'); // Quiz starts
    } catch (err) {
      setError(err.message || 'Failed to fetch questions. Please try again.');
      setQuizState('error'); // Handle errors gracefully
    }
  }, [difficulty, navigate]);

  // ------------------ SCORE CALCULATION ------------------
  const calculateScore = useCallback(() => {
    let finalScore = questions.reduce((acc, question, index) => 
      userAnswers[index] === question.correctAnswer ? acc + 1 : acc, 0
    );
    
    setScore(finalScore);

    // Store high score in localStorage
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (finalScore > highScore) {
      localStorage.setItem('quizHighScore', finalScore);
    }
  }, [questions, userAnswers]);

  // ------------------ HANDLERS ------------------
  const handleAnswerSelect = (answer) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Quiz completed → calculate score & go to results
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
    // Reset state and clear progress
    setQuizState('start');
    localStorage.removeItem('quizProgress');
    
    // Clear any stored timers (from persisted quiz timer logic)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('quizTimer_')) {
        localStorage.removeItem(key);
      }
    });

    navigate('/'); // Navigate back to homepage
  };

  // ------------------ RENDER ------------------
  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-between font-sans p-4 font-inter">
      {/* Main container */}
      <div className="w-full max-w-2xl mx-auto flex-1">
        <Header />
        
        {/* Page Routes */}
        <main className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 mt-6">
          <Routes>
            {/* Home Page → Select difficulty & Start Quiz */}
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
            
            {/* Quiz Page → Display ongoing quiz */}
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
            
            {/* Results Page → Show score & answers */}
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

      {/* Footer */}
      <footer className="text-slate-500 text-sm mt-6 mb-2">
        Made with ❤️ by Devansh Mishra
      </footer>
    </div>
  );
};

export default AppWrapper;
