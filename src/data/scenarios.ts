export type Scenario = {
  id: number;
  text: string;
  emoji: string;
  isGood: boolean;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  imageUrl?: string;
  videoUrl?: string;
};

export const defaultScenarios: Scenario[] = [
  {
    id: 1,
    text: "Anak belajar menggambar",
    emoji: "🎨🖍️",
    isGood: true,
    feedbackCorrect: "Bagus! Ini konten yang baik dan kreatif.",
    feedbackIncorrect: "Oops! Belajar menggambar itu bagus lho."
  },
  {
    id: 2,
    text: "Anak membantu teman jatuh",
    emoji: "🤝🤕",
    isGood: true,
    feedbackCorrect: "Bagus! Menolong teman itu perbuatan mulia.",
    feedbackIncorrect: "Oops! Kita harus meniru perbuatan baik ini."
  },
  {
    id: 3,
    text: "Anak berbagi makanan",
    emoji: "🍕👧👦",
    isGood: true,
    feedbackCorrect: "Bagus! Berbagi itu indah.",
    feedbackIncorrect: "Oops! Berbagi makanan itu sangat baik."
  },
  {
    id: 4,
    text: "Orang memukul teman",
    emoji: "😠👊",
    isGood: false,
    feedbackCorrect: "Hebat! Detektif yang pintar! Kita tidak boleh meniru kekerasan.",
    feedbackIncorrect: "Oops! Memukul itu tidak baik untuk ditonton."
  },
  {
    id: 5,
    text: "Prank menyakiti teman",
    emoji: "🤡😭",
    isGood: false,
    feedbackCorrect: "Hebat! Menyakiti orang lain bukan lelucon.",
    feedbackIncorrect: "Oops! Prank yang menyakiti itu berbahaya."
  },
  {
    id: 6,
    text: "Anak menolong hewan",
    emoji: "🐶❤️",
    isGood: true,
    feedbackCorrect: "Bagus! Kita harus menyayangi hewan.",
    feedbackIncorrect: "Oops! Menolong hewan itu perbuatan baik."
  },
  {
    id: 7,
    text: "Orang melakukan aksi berbahaya",
    emoji: "🛹🔥",
    isGood: false,
    feedbackCorrect: "Hebat! Jangan tiru aksi berbahaya ya.",
    feedbackIncorrect: "Oops! Aksi berbahaya bisa bikin celaka."
  },
  {
    id: 8,
    text: "Video eksperimen sains",
    emoji: "🔬🧪",
    isGood: true,
    feedbackCorrect: "Bagus! Kita bisa belajar banyak dari sains.",
    feedbackIncorrect: "Oops! Eksperimen sains itu seru dan mendidik."
  },
  {
    id: 9,
    text: "Video yang mengatakan manusia bisa terbang",
    emoji: "🦸‍♂️🪟",
    isGood: false,
    feedbackCorrect: "Hebat! Itu cuma trik, sangat berbahaya kalau ditiru.",
    feedbackIncorrect: "Oops! Manusia tidak bisa terbang, itu berbahaya!"
  },
  {
    id: 10,
    text: "Orang asing mengajak chat",
    emoji: "👤📱",
    isGood: false,
    feedbackCorrect: "Hebat! Jangan sembarangan chat dengan orang tak dikenal.",
    feedbackIncorrect: "Oops! Berbahaya bicara dengan orang asing di internet."
  }
];
