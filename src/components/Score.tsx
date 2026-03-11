import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';
import { playClickSound } from '../utils/sounds';

export default function Score({ score, total, onRestart }: { score: number, total: number, onRestart: () => void }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.6 }}
        className="bg-white p-12 md:p-24 rounded-[3rem] shadow-2xl border-8 border-amber-300 max-w-4xl w-full"
      >
        <div className="text-9xl mb-8">🏆</div>
        <h1 className="text-6xl md:text-8xl font-black text-amber-500 mb-8 drop-shadow-md">
          Detektif Hebat!
        </h1>
        
        <p className="text-4xl md:text-5xl font-bold text-slate-600 mb-12">
          Kamu berhasil menjawab <br/>
          <span className="text-6xl md:text-8xl font-black text-sky-500 block mt-6">
            {score} / {total}
          </span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playClickSound(); onRestart(); }}
          className="bg-sky-500 hover:bg-sky-600 text-white text-3xl md:text-4xl font-bold py-6 px-12 rounded-full shadow-[0_8px_0_rgb(2,132,199)] active:shadow-[0_0px_0_rgb(2,132,199)] active:translate-y-2 transition-all flex items-center justify-center gap-4 mx-auto"
        >
          <RotateCcw size={40} />
          Main Lagi
        </motion.button>
      </motion.div>
    </div>
  );
}
