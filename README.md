# Quizzyfy

A responsive and interactive quiz application built with React that tests your knowledge with timed questions across different difficulty levels.

## Features

- 10 timed questions per quiz (30 seconds per question)
- Three difficulty levels: Easy, Medium, and Hard
- Score tracking with high score persistence
- Responsive design that works on all devices
- Question review at the end of the quiz
- Local storage for saving progress and high scores
- Beautiful UI with Tailwind CSS

## Technologies Used

- React.js
- React Router
- Tailwind CSS
- Open Trivia Database API

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/react-quiz-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd react-quiz-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
or
```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

To create a production build:
```bash
npm run build
```
or
```bash
yarn build
```

To preview the production build:
```bash
npm run preview
```
or
```bash
yarn preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components for routing
├── utils/            # Utility functions
├── App.jsx           # Main App component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## How It Works

1. Select a difficulty level on the home screen
2. Click "Start Quiz" to begin
3. Answer each question within 30 seconds
4. Navigate between questions using "Previous" and "Next" buttons
5. View your results and review your answers at the end
6. Try to beat your high score!

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

