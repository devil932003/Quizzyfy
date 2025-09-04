import React from 'react';
import StartScreen from '../components/StartScreen';

const HomePage = ({ difficulty, setDifficulty, onStart }) => {
  return (
    <StartScreen 
      onStart={onStart} 
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    />
  );
};

export default HomePage;