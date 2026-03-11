import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Hand } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario } from '../data/scenarios';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/sounds';

export default function Game({ 
  scenarios, 
  generatedImages,
  setGeneratedImages,
  onFinish 
}: { 
  scenarios: Scenario[], 
  generatedImages: Record<number, string>,
  setGeneratedImages: React.Dispatch<React.SetStateAction<Record<number, string>>>,
  onFinish: (score: number) => void 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const currentScenario = scenarios[currentIndex];

  const handleAnswer = (isTonton: boolean) => {
    if (feedback !== null) return; // Prevent double click
    
    playClickSound();
    setSelectedAnswer(isTonton);
    
    const isCorrect = isTonton === currentScenario.isGood;
    
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      playCorrectSound();
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });
    } else {
      setFeedback('incorrect');
      playIncorrectSound();
    }

    setTimeout(() => {
      if (currentIndex < scenarios.length - 1) {
        setFeedback(null);
        setSelectedAnswer(null);
        setCurrentIndex(i => i + 1);
      } else {
        onFinish(score + (isCorrect ? 1 : 0));
      }
    }, 3000); // 3 seconds to read feedback
  };

  const displayImage = currentScenario.imageUrl || generatedImages[currentScenario.id];

  // Creative backgrounds for emojis
  const bgColors = [
    'from-pink-200 to-rose-300',
    'from-purple-200 to-indigo-300',
    'from-cyan-200 to-blue-300',
    'from-emerald-200 to-teal-300',
    'from-amber-200 to-orange-300',
  ];
  const currentBg = bgColors[currentIndex % bgColors.length];

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-2 md:p-4 overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col h-full max-h-[900px]">
        {/* Progress Bar */}
        <div className="w-full bg-white/50 rounded-full h-4 mb-4 shrink-0 overflow-hidden border-2 border-white shadow-inner">
          <motion.div 
            className="bg-amber-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / scenarios.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 text-center relative border-8 border-sky-200 flex flex-col flex-1 min-h-0 justify-between"
          >
            {/* Scenario Content */}
            <div className="mb-4 flex justify-center flex-1 min-h-0">
              {currentScenario.videoUrl ? (
                <video src={currentScenario.videoUrl} autoPlay loop muted className="h-full max-h-full w-auto max-w-full rounded-2xl border-4 border-slate-200 shadow-lg object-contain mx-auto" />
              ) : displayImage ? (
                <img src={displayImage} alt={currentScenario.text} className="h-full max-h-full w-auto max-w-full rounded-2xl border-4 border-slate-200 shadow-lg object-contain mx-auto" />
              ) : (
                <motion.div 
                  className={`h-full w-full max-w-3xl flex items-center justify-center rounded-3xl border-8 border-white shadow-xl mx-auto bg-gradient-to-br ${currentBg} relative`}
                  initial={{ rotate: -2 }}
                  animate={{ rotate: 2 }}
                  transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
                >
                  {/* Decorative background elements */}
                  <motion.div className="absolute top-4 left-4 text-4xl opacity-50" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>✨</motion.div>
                  <motion.div className="absolute bottom-4 right-4 text-4xl opacity-50" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>🌟</motion.div>
                  
                  <motion.div 
                    className="text-[20vh] md:text-[25vh] lg:text-[30vh] leading-none drop-shadow-2xl z-10"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                    transition={{ 
                      scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                      opacity: { duration: 0.5 }
                    }}
                  >
                    {currentScenario.emoji}
                  </motion.div>
                </motion.div>
              )}
            </div>

            <div className="shrink-0">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-2 md:mb-4 line-clamp-2">
                {currentScenario.text}
              </h2>

              <h3 className="text-lg md:text-xl font-black text-sky-600 mb-3 md:mb-4">
                Detektif! Konten ini boleh ditonton?
              </h3>

              {/* Buttons */}
              <div className="flex flex-row justify-center gap-4 md:gap-6 shrink-0">
                <motion.button
                  initial={false}
                animate={
                  feedback !== null
                    ? selectedAnswer === true
                      ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(21,128,61)" }
                      : { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
                    : { scale: 1, y: 0, boxShadow: "0px 8px 0px rgb(21,128,61)" }
                }
                whileHover={feedback === null ? { scale: 1.05, y: -2, boxShadow: "0px 10px 0px rgb(21,128,61)" } : {}}
                whileTap={feedback === null ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(21,128,61)" } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => handleAnswer(true)}
                  disabled={feedback !== null}
                  className={`flex-1 max-w-[200px] py-3 px-4 rounded-2xl text-xl md:text-2xl font-black flex flex-row justify-center items-center gap-2
                    ${feedback === null
                      ? 'bg-green-500 text-white hover:bg-green-400' 
                      : selectedAnswer === true 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-400'}`}
                >
                  <motion.div
                    animate={feedback === null ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                  >
                    <ThumbsUp size={28} fill="currentColor" />
                  </motion.div>
                  TONTON
                </motion.button>

                <motion.button
                  initial={false}
                animate={
                  feedback !== null
                    ? selectedAnswer === false
                      ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(185,28,28)" }
                      : { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
                    : { scale: 1, y: 0, boxShadow: "0px 8px 0px rgb(185,28,28)" }
                }
                whileHover={feedback === null ? { scale: 1.05, y: -2, boxShadow: "0px 10px 0px rgb(185,28,28)" } : {}}
                whileTap={feedback === null ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(185,28,28)" } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => handleAnswer(false)}
                  disabled={feedback !== null}
                  className={`flex-1 max-w-[200px] py-3 px-4 rounded-2xl text-xl md:text-2xl font-black flex flex-row justify-center items-center gap-2
                    ${feedback === null
                      ? 'bg-red-500 text-white hover:bg-red-400' 
                      : selectedAnswer === false 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-400'}`}
                >
                  <motion.div
                    animate={feedback === null ? { rotate: [0, 10, -10, 10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                  >
                    <Hand size={28} fill="currentColor" />
                  </motion.div>
                  STOP
                </motion.button>
              </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm bg-white/80`}
                >
                  <div className={`p-6 rounded-3xl shadow-2xl max-w-xl w-full mx-4 border-8 ${feedback === 'correct' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                    <div className="text-6xl mb-4">
                      {feedback === 'correct' ? '🌟' : '🤔'}
                    </div>
                    <h4 className={`text-3xl md:text-4xl font-black mb-2 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback === 'correct' ? (selectedAnswer === currentScenario.isGood && selectedAnswer === true ? 'Bagus!' : 'Hebat!') : 'Oops!'}
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-slate-700">
                      {feedback === 'correct' ? currentScenario.feedbackCorrect : currentScenario.feedbackIncorrect}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
