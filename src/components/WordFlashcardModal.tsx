import React from 'react';
import { Volume2, Star, Heart, X, CheckCircle2 } from 'lucide-react';
import { WordItem, WORDS_LOOKUP_MAP } from '../data/words';
import { speakEnglish } from '../utils/speech';

interface Props {
  wordTarget: WordItem | string | null;
  onClose: () => void;
  learnedWordIds: string[];
  favoriteWordIds: string[];
  onToggleLearned: (wordId: string) => void;
  onToggleFavorite: (wordId: string) => void;
}

export const WordFlashcardModal: React.FC<Props> = ({
  wordTarget,
  onClose,
  learnedWordIds,
  favoriteWordIds,
  onToggleLearned,
  onToggleFavorite,
}) => {
  if (!wordTarget) return null;

  // Resolve WordItem
  let wordData: WordItem;

  if (typeof wordTarget === 'string') {
    const clean = wordTarget.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = WORDS_LOOKUP_MAP[clean] || WORDS_LOOKUP_MAP[clean.replace(/s$/, '')] || WORDS_LOOKUP_MAP[clean.replace(/es$/, '')] || WORDS_LOOKUP_MAP[clean.replace(/ing$/, '')] || WORDS_LOOKUP_MAP[clean.replace(/ed$/, '')];

    if (found) {
      wordData = found;
    } else {
      // Dynamic fallback for words outside the 100-word core dictionary
      const capitalized = wordTarget.charAt(0).toUpperCase() + wordTarget.slice(1).toLowerCase();
      wordData = {
        id: `custom_${clean}`,
        word: capitalized,
        ipa: `/${clean}/`,
        meaning: `Từ trong câu: "${capitalized}"`,
        category: 'Từ vựng trong hội thoại',
        categoryEn: 'dialogue',
        emoji: '💡',
        exampleEn: `Listen and pronounce: "${capitalized}"`,
        exampleVi: `Nghe phát âm chuẩn và luyện đọc từ này nhé bé.`,
        partOfSpeech: 'Từ vựng',
      };
    }
  } else {
    wordData = wordTarget;
  }

  const isLearned = learnedWordIds.includes(wordData.id);
  const isFavorite = favoriteWordIds.includes(wordData.id);

  const handlePlayAudio = () => {
    speakEnglish(wordData.word);
  };

  const handlePlayExample = () => {
    speakEnglish(wordData.exampleEn);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden p-6 sm:p-7 text-slate-800 animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span>{wordData.emoji}</span>
            <span>{wordData.category}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(wordData.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
              title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Display & Audio */}
        <div className="py-6 text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-amber-50 flex items-center justify-center text-4xl shadow-inner border border-amber-100">
            {wordData.emoji}
          </div>

          <div className="flex items-center justify-center gap-3">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {wordData.word}
            </h3>
            <button
              onClick={handlePlayAudio}
              className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-transform"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {wordData.ipa} • <span className="italic">{wordData.partOfSpeech}</span>
          </p>

          <div className="mt-4 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Ý nghĩa</p>
            <p className="text-xl font-bold text-emerald-900 mt-0.5">{wordData.meaning}</p>
          </div>
        </div>

        {/* Example sentence */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ví dụ minh họa</span>
            <button
              onClick={handlePlayExample}
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe câu</span>
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-800">"{wordData.exampleEn}"</p>
          <p className="text-xs text-slate-500 mt-1 italic">{wordData.exampleVi}</p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleLearned(wordData.id)}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              isLearned
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
            }`}
          >
            {isLearned ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>Đã thuộc từ này ⭐</span>
              </>
            ) : (
              <>
                <Star className="w-5 h-5 text-amber-500" />
                <span>Đánh dấu Đã Thuộc</span>
              </>
            )}
          </button>
          <button
            onClick={handlePlayAudio}
            className="py-3 px-4 rounded-2xl font-semibold text-sm bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" />
            <span>Phát âm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
