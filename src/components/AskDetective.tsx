import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, Loader2, ThumbsUp, Hand, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scenario } from '../data/scenarios';
import { askDetective } from '../services/geminiService';
import { playClickSound, playCorrectSound, playIncorrectSound } from '../utils/sounds';

export default function AskDetective({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    playClickSound();
    setIsLoading(true);
    setScenario(null);
    setFeedback(null);
    setSelectedAnswer(null);

    try {
      const result = await askDetective(question);
      setScenario(result);
    } catch (error) {
      console.error("Failed to ask detective:", error);
      alert("Maaf, detektif sedang sibuk. Coba lagi nanti ya!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isTonton: boolean) => {
    if (feedback !== null || !scenario) return;
    
    playClickSound();
    setSelectedAnswer(isTonton);
    
    const isCorrect = isTonton === scenario.isGood;
    
    if (isCorrect) {
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
  };

  const resetAsk = () => {
    playClickSound();
    setScenario(null);
    setQuestion('');
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const toggleExplanation = () => {
    playClickSound();
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <button 
        onClick={() => { playClickSound(); onBack(); }}
        className="absolute top-4 left-4 p-2 text-sky-600 hover:text-sky-800 transition-colors bg-white rounded-full shadow-md z-20"
        title="Kembali"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {!scenario ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-8 border-sky-200"
          >
            <div className="text-8xl mb-6">🕵️‍♂️</div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-500 mb-4 drop-shadow-sm">
              Tanya Detektif!
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
              Tuliskan apa yang ingin kamu tonton atau lakukan, dan Detektif akan memberitahu apakah itu aman!
            </p>

            <form onSubmit={handleAsk} className="flex flex-col gap-4 max-w-2xl mx-auto mb-8">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Contoh: Pak, kalau aku nonton video orang main game seharian boleh tidak?"
                className="w-full p-4 rounded-2xl border-4 border-slate-200 text-xl md:text-2xl focus:border-sky-400 focus:outline-none resize-none h-32"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!question.trim() || isLoading}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white text-2xl md:text-3xl font-bold py-4 px-8 rounded-2xl shadow-[0_6px_0_rgb(2,132,199)] active:shadow-[0_0px_0_rgb(2,132,199)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={32} />
                    Detektif Sedang Berpikir...
                  </>
                ) : (
                  <>
                    <Search size={32} />
                    Tanya Sekarang!
                  </>
                )}
              </motion.button>
            </form>

            {/* AI Explanation Section */}
            <div className="max-w-2xl mx-auto text-left bg-sky-50 rounded-2xl border-2 border-sky-100 overflow-hidden">
              <button 
                onClick={toggleExplanation}
                className="w-full p-4 flex items-center justify-between text-sky-700 hover:bg-sky-100 transition-colors font-bold text-lg"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={24} className="text-amber-500" />
                  Bagaimana Detektif Bekerja?
                </div>
                {showExplanation ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 text-slate-600 text-base md:text-lg"
                  >
                    <p className="mb-2">
                      Detektif ini dibantu oleh <strong>Kecerdasan Buatan (AI)</strong> yang sangat pintar!
                    </p>
                    <p>
                      Saat kamu bertanya, AI akan membaca pertanyaanmu dan memikirkan apakah hal itu <strong>aman, mendidik, dan baik</strong> untuk anak-anak. Jika ada unsur kekerasan, kata-kata kasar, atau hal berbahaya, AI akan menyarankanmu untuk <strong>STOP!</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white rounded-3xl shadow-2xl p-4 md:p-8 text-center relative border-8 border-sky-200 flex flex-col"
          >
            <div className="mb-6 flex justify-center">
              <motion.div 
                className="w-full max-w-3xl aspect-video flex items-center justify-center rounded-3xl border-8 border-white shadow-xl mx-auto bg-gradient-to-br from-indigo-200 to-purple-300 relative overflow-hidden"
                initial={{ rotate: -2 }}
                animate={{ rotate: 2 }}
                transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
              >
                <motion.div className="absolute top-4 left-4 text-4xl opacity-50" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>✨</motion.div>
                <motion.div className="absolute bottom-4 right-4 text-4xl opacity-50" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>🌟</motion.div>
                
                <motion.div 
                  className="text-[15vh] md:text-[20vh] lg:text-[25vh] leading-none drop-shadow-2xl z-10"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    opacity: { duration: 0.5 }
                  }}
                >
                  {scenario.emoji}
                </motion.div>
              </motion.div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
              {scenario.text}
            </h2>

            <h3 className="text-xl md:text-2xl font-black text-sky-600 mb-6">
              Detektif! Konten ini boleh ditonton?
            </h3>

            {/* Buttons */}
            <div className="flex flex-row justify-center gap-4 md:gap-6">
              <motion.button
                animate={
                  feedback !== null
                    ? selectedAnswer === true
                      ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(21,128,61)" }
                      : { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
                    : { scale: 1, y: 0, boxShadow: "0px 8px 0px rgb(21,128,61)" }
                }
                whileHover={feedback === null ? { scale: 1.05, y: -2, boxShadow: "0px 10px 0px rgb(21,128,61)" } : {}}
                whileTap={feedback === null ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(21,128,61)" } : {}}
                onClick={() => handleAnswer(true)}
                disabled={feedback !== null}
                className={`flex-1 max-w-[200px] py-3 px-4 rounded-2xl text-xl md:text-2xl font-black flex flex-row justify-center items-center gap-2
                  ${feedback === null
                    ? 'bg-green-500 text-white hover:bg-green-400' 
                    : selectedAnswer === true 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-400'}`}
              >
                <ThumbsUp size={28} />
                TONTON
              </motion.button>

              <motion.button
                animate={
                  feedback !== null
                    ? selectedAnswer === false
                      ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(185,28,28)" }
                      : { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
                    : { scale: 1, y: 0, boxShadow: "0px 8px 0px rgb(185,28,28)" }
                }
                whileHover={feedback === null ? { scale: 1.05, y: -2, boxShadow: "0px 10px 0px rgb(185,28,28)" } : {}}
                whileTap={feedback === null ? { scale: 0.95, y: 8, boxShadow: "0px 0px 0px rgb(185,28,28)" } : {}}
                onClick={() => handleAnswer(false)}
                disabled={feedback !== null}
                className={`flex-1 max-w-[200px] py-3 px-4 rounded-2xl text-xl md:text-2xl font-black flex flex-row justify-center items-center gap-2
                  ${feedback === null
                    ? 'bg-red-500 text-white hover:bg-red-400' 
                    : selectedAnswer === false 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-400'}`}
              >
                <Hand size={28} />
                STOP
              </motion.button>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm bg-white/80`}
                >
                  <div className={`p-6 rounded-3xl shadow-2xl max-w-xl w-full mx-4 border-8 ${feedback === 'correct' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                    <div className="text-6xl mb-4">
                      {feedback === 'correct' ? '🌟' : '🤔'}
                    </div>
                    <h4 className={`text-3xl md:text-4xl font-black mb-2 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback === 'correct' ? (selectedAnswer === scenario.isGood && selectedAnswer === true ? 'Bagus!' : 'Hebat!') : 'Oops!'}
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-slate-700 mb-6">
                      {feedback === 'correct' ? scenario.feedbackCorrect : scenario.feedbackIncorrect}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetAsk}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-[0_4px_0_rgb(217,119,6)] active:shadow-[0_0px_0_rgb(217,119,6)] active:translate-y-1 transition-all"
                    >
                      Tanya Lagi
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
