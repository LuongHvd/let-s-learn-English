import React, { useState, useEffect } from 'react';
import { Volume2, Star, Heart, RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sparkles, Trophy, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, WORDS_DICTIONARY, VOCABULARY_CATEGORIES } from '../data/words';
import { speakEnglish } from '../utils/speech';

interface Props {
  learnedWordIds: string[];
  favoriteWordIds: string[];
  onToggleLearned: (wordId: string) => void;
  onToggleFavorite: (wordId: string) => void;
  onIncrementReviewCount: () => void;
}

type TabMode = 'flip' | 'quiz';

export const FlashcardViewer: React.FC<Props> = ({
  learnedWordIds,
  favoriteWordIds,
  onToggleLearned,
  onToggleFavorite,
  onIncrementReviewCount,
}) => {
  const [tabMode, setTabMode] = useState<TabMode>('flip');
  const [filterMode, setFilterMode] = useState<'all' | 'learned' | 'unlearned' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<WordItem[]>(WORDS_DICTIONARY);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Filter deck whenever filters change
  useEffect(() => {
    let filtered = WORDS_DICTIONARY;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.categoryEn === selectedCategory);
    }

    if (filterMode === 'learned') {
      filtered = filtered.filter(w => learnedWordIds.includes(w.id));
    } else if (filterMode === 'unlearned') {
      filtered = filtered.filter(w => !learnedWordIds.includes(w.id));
    } else if (filterMode === 'favorites') {
      filtered = filtered.filter(w => favoriteWordIds.includes(w.id));
    }

    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterMode, selectedCategory, learnedWordIds, favoriteWordIds]);

  const currentWord: WordItem | undefined = deck[currentIndex];

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
  };

  const handleMarkLearnedFromCard = () => {
    if (!currentWord) return;
    if (!learnedWordIds.includes(currentWord.id)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      onToggleLearned(currentWord.id);
    }
    onIncrementReviewCount();
    handleNext();
  };

  const handleMarkNeedReview = () => {
    onIncrementReviewCount();
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tabMode !== 'flip') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, tabMode]);

  // Quiz generator helpers
  const currentQuizWord = deck[quizQuestionIndex % (deck.length || 1)];

  // Generate 4 options for quiz
  const quizOptions = React.useMemo(() => {
    if (!currentQuizWord || deck.length === 0) return [];
    const correct = currentQuizWord.meaning;
    const pool = WORDS_DICTIONARY.filter(w => w.id !== currentQuizWord.id);
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const distractors = shuffledPool.slice(0, 3).map(w => w.meaning);
    return [...distractors, correct].sort(() => Math.random() - 0.5);
  }, [currentQuizWord, quizQuestionIndex]);

  const handleSelectQuizAnswer = (option: string) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(option);

    const isCorrect = option === currentQuizWord?.meaning;
    if (isCorrect) {
      setQuizScore(s => s + 1);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (currentQuizWord && !learnedWordIds.includes(currentQuizWord.id)) {
        onToggleLearned(currentQuizWord.id);
      }
    }
    onIncrementReviewCount();

    setTimeout(() => {
      setQuizAnswerSelected(null);
      if (quizQuestionIndex + 1 >= Math.min(10, deck.length)) {
        setIsQuizFinished(true);
      } else {
        setQuizQuestionIndex(i => i + 1);
      }
    }, 1400);
  };

  const handleRestartQuiz = () => {
    setQuizScore(0);
    setQuizQuestionIndex(0);
    setQuizAnswerSelected(null);
    setIsQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>🗂️</span> Học Flashcard Từ Vựng
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Lật thẻ học từ mới hoặc ôn tập lại các từ cũ đã học để ghi nhớ thật lâu!
          </p>
        </div>

        {/* Tab switch: Flip cards vs Quiz */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setTabMode('flip')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tabMode === 'flip'
                ? 'bg-white shadow-xs text-amber-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎴 Lật Thẻ Học
          </button>
          <button
            onClick={() => {
              setTabMode('quiz');
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tabMode === 'quiz'
                ? 'bg-white shadow-xs text-amber-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Đố Vui Ôn Tập
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Main Status Filters: All / Learned (Ôn từ cũ) / Unlearned / Favorites */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả ({WORDS_DICTIONARY.length})
          </button>

          <button
            onClick={() => setFilterMode('learned')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'learned'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>⭐ Ôn từ vựng cũ đã thuộc</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/50 text-[10px]">
              {learnedWordIds.length}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('unlearned')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterMode === 'unlearned'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Chưa thuộc ({WORDS_DICTIONARY.length - learnedWordIds.length})
          </button>

          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'favorites'
                ? 'bg-rose-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>❤️ Yêu thích</span>
            <span>({favoriteWordIds.length})</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VOCABULARY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon} {cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {deck.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">Không có thẻ nào phù hợp</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            {filterMode === 'learned'
              ? 'Bé chưa đánh dấu từ vựng cũ nào! Hãy học các thẻ từ vựng và bấm "Đã nhớ rồi" để tích lũy nhé.'
              : 'Hãy thử chọn chủ đề khác hoặc bấm "Tất cả từ" nhé.'}
          </p>
          <button
            onClick={() => {
              setFilterMode('all');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs"
          >
            Xem tất cả từ vựng
          </button>
        </div>
      ) : tabMode === 'flip' ? (
        /* FLIP CARD MODE */
        <div className="max-w-xl mx-auto space-y-4">
          {/* Card counter and shuffle */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
            <span>
              Thẻ {currentIndex + 1} / {deck.length}
            </span>
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="Xáo trộn thứ tự thẻ"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Xáo trộn</span>
            </button>
          </div>

          {/* Flashcard container with flip animation */}
          {currentWord && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-88 sm:h-96 rounded-3xl bg-white border-4 border-amber-200/80 shadow-lg cursor-pointer p-6 sm:p-8 flex flex-col justify-between transition-all select-none hover:shadow-xl hover:border-amber-300"
              style={{ perspective: '1000px' }}
            >
              {/* Top Row: Category + Favorite toggle */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>{currentWord.emoji}</span>
                  <span>{currentWord.category}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(currentWord.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      favoriteWordIds.includes(currentWord.id)
                        ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favoriteWordIds.includes(currentWord.id) ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Card Center: Front vs Back */}
              {!isFlipped ? (
                /* FRONT: English word, IPA, audio, emoji */
                <div className="text-center py-2">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-amber-50/70 border border-amber-200 flex items-center justify-center text-5xl shadow-inner">
                    {currentWord.emoji}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {currentWord.word}
                    </h3>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        speakEnglish(currentWord.word);
                      }}
                      className="p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-transform"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="mt-2 text-base font-semibold text-slate-400 tracking-wide">
                    {currentWord.ipa}
                  </p>

                  <p className="mt-4 text-xs font-medium text-amber-700/80 inline-flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    <RotateCcw className="w-3.5 h-3.5" /> Chạm vào thẻ để xem nghĩa tiếng Việt
                  </p>
                </div>
              ) : (
                /* BACK: Meaning, example sentence, audio */
                <div className="text-center py-2 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Nghĩa Tiếng Việt
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mt-2">
                    {currentWord.meaning}
                  </h3>

                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Câu ví dụ</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          speakEnglish(currentWord.exampleEn);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe</span>
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      "{currentWord.exampleEn}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      {currentWord.exampleVi}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="text-center text-xs text-slate-400">
                {learnedWordIds.includes(currentWord.id) ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Bé đã thuộc từ này ⭐
                  </span>
                ) : (
                  <span>Chưa thuộc • Hãy nghe và nhắc lại nhé!</span>
                )}
              </div>
            </div>
          )}

          {/* Navigation and Feedback Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
              title="Thẻ trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 flex-1 justify-center max-w-sm">
              <button
                onClick={handleMarkNeedReview}
                className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                Chưa nhớ lắm 🧐
              </button>

              <button
                onClick={handleMarkLearnedFromCard}
                className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white text-emerald-600" />
                <span>Đã nhớ rồi!</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
              title="Thẻ tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ MODE */
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {!isQuizFinished && currentQuizWord ? (
            <div className="space-y-6">
              {/* Quiz progress */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Câu {quizQuestionIndex + 1} / {Math.min(10, deck.length)}</span>
                <span className="text-amber-600 font-bold">Điểm: {quizScore} 🏆</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${((quizQuestionIndex + 1) / Math.min(10, deck.length)) * 100}%` }}
                />
              </div>

              {/* Question display */}
              <div className="text-center py-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <div className="text-5xl mb-2">{currentQuizWord.emoji}</div>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{currentQuizWord.word}</h3>
                  <button
                    onClick={() => speakEnglish(currentQuizWord.word)}
                    className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Từ này trong tiếng Việt có nghĩa là gì?</p>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizOptions.map((opt, idx) => {
                  const isChosen = quizAnswerSelected === opt;
                  const isCorrect = opt === currentQuizWord.meaning;
                  let btnStyle = 'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800';

                  if (quizAnswerSelected !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white font-bold';
                    } else if (isChosen && !isCorrect) {
                      btnStyle = 'bg-rose-500 border-2 border-rose-600 text-white font-bold';
                    } else {
                      btnStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizAnswerSelected !== null}
                      onClick={() => handleSelectQuizAnswer(opt)}
                      className={`p-4 rounded-2xl text-base font-semibold text-center transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-200">
                🏆
              </div>
              <h3 className="text-2xl font-black text-slate-900">Hoan hô bé đã hoàn thành!</h3>
              <p className="text-base text-slate-600">
                Bé đã trả lời đúng <strong>{quizScore}</strong> / {Math.min(10, deck.length)} câu hỏi.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
                >
                  Chơi lại ván mới
                </button>
                <button
                  onClick={() => setTabMode('flip')}
                  className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  Trở về lật thẻ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
