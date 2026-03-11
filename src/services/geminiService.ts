import { GoogleGenAI, Type } from '@google/genai';
import { Scenario } from '../data/scenarios';

export const askDetective = async (question: string): Promise<Scenario> => {
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Seorang anak bertanya: "${question}"
    
Tolong evaluasi apakah konten atau aktivitas yang ditanyakan ini aman, baik, dan mendidik untuk anak-anak (isGood: true), atau berbahaya, tidak pantas, dan buruk (isGood: false).
Berikan emoji yang sangat representatif (1-3 emoji) untuk memvisualisasikan skenario ini.
Berikan feedbackCorrect (pujian jika anak menjawab benar sesuai isGood) dan feedbackIncorrect (nasihat jika anak menjawab salah).
Gunakan bahasa Indonesia yang ramah anak, ceria, dan mudah dipahami.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: 'Ringkasan singkat dari pertanyaan anak (maksimal 5-7 kata)'
          },
          emoji: {
            type: Type.STRING,
            description: '1 hingga 3 emoji yang sangat merepresentasikan skenario ini'
          },
          isGood: {
            type: Type.BOOLEAN,
            description: 'true jika konten/aktivitas aman dan baik untuk anak, false jika berbahaya atau tidak pantas'
          },
          feedbackCorrect: {
            type: Type.STRING,
            description: 'Pujian ramah anak jika mereka menebak dengan benar (misal: "Hebat! Detektif pintar, itu memang tidak boleh ditiru.")'
          },
          feedbackIncorrect: {
            type: Type.STRING,
            description: 'Nasihat ramah anak jika mereka menebak salah (misal: "Oops! Ingat ya, memukul itu perbuatan yang tidak baik.")'
          }
        },
        required: ['text', 'emoji', 'isGood', 'feedbackCorrect', 'feedbackIncorrect']
      }
    }
  });

  const jsonStr = response.text?.trim() || '{}';
  const result = JSON.parse(jsonStr);

  return {
    id: Date.now(),
    text: result.text,
    emoji: result.emoji,
    isGood: result.isGood,
    feedbackCorrect: result.feedbackCorrect,
    feedbackIncorrect: result.feedbackIncorrect
  };
};
