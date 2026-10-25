import React, { useState } from 'react';
import { Search, Volume2, Star, Heart, CheckCircle2, Filter } from 'lucide-react';
import { WordItem, WORDS_DICTIONARY, VOCABULARY_CATEGORIES } from '../data/words';
import { speakEnglish } from '../utils/speech';

interface Props {
  learnedWordIds: string[];
  favoriteWordIds: string[];
  onToggleLearned: (wordId: string) => void;
  onToggleFavorite: (wordId: string) => void;
  onSelectWord: (word: WordItem) => void;
}

export const DictionaryBrowser: React.FC<Props> = ({
  learnedWordIds,
  favoriteWordIds,
  onToggleLearned,
  onToggleFavorite,
  onSelectWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWords = WORDS_DICTIONARY.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      item.word.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.exampleEn.toLowerCase().includes(query);
    const matchCategory = selectedCategory === 'all' || item.categoryEn === selectedCategory;
    return matchQuery && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>📖</span> Kho Từ Điển Tiếng Anh (100 Từ Thiết Yếu)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tra cứu từ vựng kèm hình ảnh minh họa, phát âm chuẩn giọng bản xứ và ví dụ gần gũi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-2xl border border-amber-200 text-sm font-semibold self-start sm:self-auto">
          <span>⭐ Đã thuộc: {learnedWordIds.length} / {WORDS_DICTIONARY.length} từ</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm từ tiếng Anh hoặc nghĩa tiếng Việt (ví dụ: apple, chú chó...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm text-slate-800 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VOCABULARY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon} {cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Word Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredWords.map(item => {
          const isLearned = learnedWordIds.includes(item.id);
          const isFavorite = favoriteWordIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectWord(item)}
              className={`p-4 rounded-3xl bg-white border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
                isLearned
                  ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400'
                  : 'border-slate-100 hover:border-amber-300'
              }`}
            >
              <div>
                {/* Top: emoji & favorite */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        speakEnglish(item.word);
                      }}
                      className="p-1.5 rounded-full text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Word & Meaning */}
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {item.word}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.ipa}</p>
                <p className="text-sm font-bold text-emerald-800 mt-1">{item.meaning}</p>
              </div>

              {/* Bottom: Learned tag & category */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{item.category}</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleLearned(item.id);
                  }}
                  className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isLearned
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <Star className={`w-3 h-3 ${isLearned ? 'fill-emerald-600 text-emerald-600' : 'text-slate-400'}`} />
                  <span>{isLearned ? 'Đã thuộc' : 'Học từ này'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy từ nào</h3>
          <p className="text-xs text-slate-500 mt-1">
            Bé hãy thử tìm kiếm với từ khóa khác nhé.
          </p>
        </div>
      )}
    </div>
  );
};
