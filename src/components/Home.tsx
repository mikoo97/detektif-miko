import { motion } from 'motion/react';
import { Play, Settings } from 'lucide-react';
import { playClickSound } from '../utils/sounds';

export default function Home({ onStart, onAdmin }: { onStart: () => void, onAdmin: () => void }) {
  const handleStart = async () => {
    playClickSound();
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
          await window.aistudio.openSelectKey();
        } catch (e) {
          console.error(e);
        }
      }
    }
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <button 
        onClick={onAdmin}
        className="absolute top-4 right-4 p-2 text-sky-400 hover:text-sky-600 transition-colors"
        title="Pengaturan Guru"
      >
        <Settings size={24} />
      </button>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center max-w-3xl"
      >
        <div className="text-9xl mb-6 flex justify-center gap-4">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            🕵️‍♂️
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            🔍
          </motion.div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-amber-500 drop-shadow-lg mb-4 tracking-tight" style={{ WebkitTextStroke: '3px white' }}>
          Aku Detektif Konten!
        </h1>
        
        <p className="text-3xl md:text-5xl font-bold text-sky-600 mb-12 drop-shadow-md">
          Ayo pilih: Tonton atau Stop?
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white text-4xl md:text-5xl font-bold py-6 px-12 rounded-full shadow-[0_8px_0_rgb(21,128,61)] active:shadow-[0_0px_0_rgb(21,128,61)] active:translate-y-2 transition-all flex items-center justify-center gap-4 mx-auto"
        >
          <Play size={48} fill="currentColor" />
          Mulai Misi
        </motion.button>
      </motion.div>
    </div>
  );
}
