import React, { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Video, Wand2, Upload, Plus } from 'lucide-react';
import { Scenario } from '../data/scenarios';
import { generateImage, editImage, generateVideo } from '../services/ai';

export default function Admin({ scenarios, setScenarios, onBack }: { scenarios: Scenario[], setScenarios: (s: Scenario[]) => void, onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    text: '',
    isGood: true,
    feedbackCorrect: 'Bagus!',
    feedbackIncorrect: 'Oops!',
    emoji: '❓'
  });

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkApiKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    try {
      setLoading(true);
      setLoadingMsg('Sedang menggambar dengan AI...');
      setError('');
      await checkApiKey();
      const img = await generateImage(prompt, aspectRatio);
      setGeneratedImage(img);
      setNewScenario({ ...newScenario, imageUrl: img });
    } catch (err: any) {
      if (err.message?.includes('Requested entity was not found')) {
        if (window.aistudio) await window.aistudio.openSelectKey();
      }
      setError(err.message || 'Gagal membuat gambar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!prompt || !generatedImage) return;
    try {
      setLoading(true);
      setLoadingMsg('Sedang mengedit gambar dengan AI...');
      setError('');
      await checkApiKey();
      const mimeType = generatedImage.match(/data:(.*?);base64/)?.[1] || 'image/png';
      const img = await editImage(prompt, generatedImage, mimeType);
      setGeneratedImage(img);
      setNewScenario({ ...newScenario, imageUrl: img });
    } catch (err: any) {
      setError(err.message || 'Gagal mengedit gambar');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!generatedImage) return;
    try {
      setLoading(true);
      setLoadingMsg('Sedang membuat video animasi... (Ini bisa memakan waktu beberapa menit)');
      setError('');
      await checkApiKey();
      const mimeType = generatedImage.match(/data:(.*?);base64/)?.[1] || 'image/png';
      const videoRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
      const vid = await generateVideo(generatedImage, mimeType, videoRatio);
      setGeneratedVideo(vid);
      setNewScenario({ ...newScenario, videoUrl: vid });
    } catch (err: any) {
      setError(err.message || 'Gagal membuat video');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneratedImage(reader.result as string);
        setNewScenario({ ...newScenario, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!newScenario.text) {
      setError('Teks skenario harus diisi');
      return;
    }
    const scenario: Scenario = {
      id: Date.now(),
      text: newScenario.text,
      emoji: newScenario.emoji || '❓',
      isGood: newScenario.isGood ?? true,
      feedbackCorrect: newScenario.feedbackCorrect || 'Bagus!',
      feedbackIncorrect: newScenario.feedbackIncorrect || 'Oops!',
      imageUrl: newScenario.imageUrl,
      videoUrl: newScenario.videoUrl
    };
    setScenarios([...scenarios, scenario]);
    onBack();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8 border-b pb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Buat Misi Baru (Guru)</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: AI Generation */}
          <div className="space-y-6 bg-sky-50 p-6 rounded-2xl border border-sky-100">
            <h2 className="text-xl font-bold text-sky-800 flex items-center gap-2">
              <Wand2 size={20} /> Studio AI
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prompt Gambar / Edit</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                rows={3}
                placeholder="Contoh: Anak kecil sedang membaca buku di taman..."
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rasio Aspek</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none"
                >
                  <option value="1:1">1:1 (Kotak)</option>
                  <option value="16:9">16:9 (Layar Lebar)</option>
                  <option value="9:16">9:16 (Vertikal)</option>
                  <option value="4:3">4:3</option>
                  <option value="3:4">3:4</option>
                  <option value="3:2">3:2</option>
                  <option value="2:3">2:3</option>
                  <option value="21:9">21:9</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleGenerateImage}
                disabled={loading || !prompt}
                className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ImageIcon size={18} /> Buat Gambar
              </button>
              
              <button 
                onClick={handleEditImage}
                disabled={loading || !prompt || !generatedImage}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Wand2 size={18} /> Edit Gambar
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-sky-50 text-slate-500">ATAU</span>
              </div>
            </div>

            <div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white border-2 border-dashed border-slate-300 hover:border-sky-500 text-slate-600 py-4 rounded-xl font-semibold flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Upload size={24} /> Upload Foto Sendiri
              </button>
            </div>

            {generatedImage && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Animasi Video (Veo)</label>
                <button 
                  onClick={handleGenerateVideo}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Video size={18} /> Animasikan Gambar Ini
                </button>
                <p className="text-xs text-slate-500 mt-2 text-center">Hanya mendukung rasio 16:9 atau 9:16</p>
              </div>
            )}
          </div>

          {/* Right Column: Scenario Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Detail Skenario</h2>
            
            {/* Preview Area */}
            <div className="bg-slate-100 rounded-2xl aspect-video flex items-center justify-center overflow-hidden border border-slate-200 relative">
              {loading ? (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                  <p className="text-sky-700 font-medium">{loadingMsg}</p>
                </div>
              ) : generatedVideo ? (
                <video src={generatedVideo} autoPlay loop muted className="w-full h-full object-contain bg-black" />
              ) : generatedImage ? (
                <img src={generatedImage} alt="Preview" className="w-full h-full object-contain bg-black" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span>Belum ada media</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Teks Pertanyaan / Situasi</label>
              <input 
                type="text"
                value={newScenario.text}
                onChange={(e) => setNewScenario({...newScenario, text: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Contoh: Orang asing mengajak chat"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Jawaban Benar</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setNewScenario({...newScenario, isGood: true})}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors ${newScenario.isGood ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  TONTON (Baik)
                </button>
                <button
                  onClick={() => setNewScenario({...newScenario, isGood: false})}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors ${!newScenario.isGood ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  STOP (Buruk)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan Jika Benar</label>
                <input 
                  type="text"
                  value={newScenario.feedbackCorrect}
                  onChange={(e) => setNewScenario({...newScenario, feedbackCorrect: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan Jika Salah</label>
                <input 
                  type="text"
                  value={newScenario.feedbackIncorrect}
                  onChange={(e) => setNewScenario({...newScenario, feedbackIncorrect: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors mt-8 shadow-lg"
            >
              <Plus size={24} /> Tambahkan ke Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
