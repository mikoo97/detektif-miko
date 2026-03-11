import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Score from './components/Score';
import Admin from './components/Admin';
import { defaultScenarios, Scenario } from './data/scenarios';

export default function App() {
  const [gameState, setGameState] = useState<'home' | 'playing' | 'score' | 'admin'>('home');
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
  const [score, setScore] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});

  const startGame = () => {
    setScore(0);
    setGameState('playing');
  };

  const finishGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState('score');
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800 overflow-hidden">
      {gameState === 'home' && <Home onStart={startGame} onAdmin={() => setGameState('admin')} />}
      {gameState === 'playing' && <Game scenarios={scenarios} generatedImages={generatedImages} setGeneratedImages={setGeneratedImages} onFinish={finishGame} />}
      {gameState === 'score' && <Score score={score} total={scenarios.length} onRestart={() => setGameState('home')} />}
      {gameState === 'admin' && <Admin scenarios={scenarios} setScenarios={setScenarios} onBack={() => setGameState('home')} />}
    </div>
  );
}
