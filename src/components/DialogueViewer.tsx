import React, { useState } from 'react';
import { Volume2, CheckCircle, Play, Pause, RotateCcw, Eye, EyeOff, Sparkles, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DIALOGUES, DialogueItem, DialogueLine } from '../data/dialogues';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface Props {
  completedDialogueIds: string[];
  onToggleCompleteDialogue: (dialogueId: string) => void;
  onSelectWord: (word: string) => void;
}

export const DialogueViewer: React.FC<Props> = ({
  completedDialogueIds,
  onToggleCompleteDialogue,
  onSelectWord,
}) => {
  const [activeDialogue, setActiveDialogue] = useState<DialogueItem | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Giao tiếp hàng ngày', 'Sở thích & Vui chơi', 'Thế giới động vật', 'Món ăn & Đồ uống', 'Thói quen hàng ngày', 'Trường học'];

  const filteredDialogues = DIALOGUES.filter(d => {
    const matchesSearch = d.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.titleVi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectDialogue = (d: DialogueItem) => {
    stopSpeaking();
    setIsPlayingAll(false);
    setCurrentLineIndex(null);
    setSelectedRole(null);
    setActiveDialogue(d);
  };

  const handlePlayLine = (line: DialogueLine, index: number) => {
    setCurrentLineIndex(index);
    speakEnglish(line.text);
  };

  const handlePlayFullDialogue = async () => {
    if (!activeDialogue) return;
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setCurrentLineIndex(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < activeDialogue.lines.length; i++) {
      setCurrentLineIndex(i);
      const line = activeDialogue.lines[i];

      // If user selected a role to practice, pause longer on user's role without speaking, or speak gently
      if (selectedRole && line.speaker === selectedRole) {
        // Child's turn to speak!
        await new Promise(r => setTimeout(r, 3200));
      } else {
        speakEnglish(line.text);
        // Estimate sentence reading duration based on word count
        const wordCount = line.text.split(' ').length;
        const waitTimeMs = Math.max(2200, wordCount * 550);
        await new Promise(r => setTimeout(r, waitTimeMs));
      }
    }
    setIsPlayingAll(false);
    setCurrentLineIndex(null);
  };

  const handleFinishDialogue = (d: DialogueItem) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onToggleCompleteDialogue(d.id);
  };

  // Helper to split sentence into clickable words
  const renderInteractiveSentence = (text: string) => {
    // Split by whitespace while preserving punctuation boundaries
    const tokens = text.split(/(\s+)/);

    return tokens.map((token, idx) => {
      if (/^\s+$/.test(token)) {
        return <span key={idx}>{token}</span>;
      }

      // Strip punctuation to find raw word
      const cleanWord = token.replace(/[^a-zA-Z]/g, '');

      if (!cleanWord) {
        return <span key={idx}>{token}</span>;
      }

      // Keep punctuation outside or intact
      const match = token.match(/^([^a-zA-Z]*)([a-zA-Z]+)([^a-zA-Z]*)$/);
      if (match) {
        const [, prefix, word, suffix] = match;
        return (
          <span key={idx} className="inline-block">
            {prefix}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onSelectWord(word);
              }}
              className="inline px-1 py-0.5 rounded-lg hover:bg-amber-100 hover:text-amber-900 active:bg-amber-200 transition-colors font-medium cursor-pointer underline decoration-dotted decoration-amber-300 underline-offset-4"
              title={`Nhấp để xem Flashcard từ "${word}"`}
            >
              {word}
            </button>
            {suffix}
          </span>
        );
      }

      return (
        <button
          key={idx}
          type="button"
          onClick={e => {
            e.stopPropagation();
            onSelectWord(cleanWord);
          }}
          className="inline px-1 py-0.5 rounded hover:bg-amber-100 text-slate-800 transition-colors font-medium cursor-pointer"
        >
          {token}
        </button>
      );
    });
  };

  return (
    <div className="space-y-6">
      {!activeDialogue ? (
        /* Dialogue List View */
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>💬</span> 20 Đoạn Hội Thoại Tiếng Anh Cho Bé
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Luyện nghe phát âm chuẩn và <strong>chạm vào bất kỳ từ nào</strong> để xem flashcard của từ đó!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200 text-sm font-semibold self-start sm:self-auto">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Đã hoàn thành: {completedDialogueIds.length} / {DIALOGUES.length}</span>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề hoặc tiêu đề hội thoại..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm text-slate-800 shadow-xs"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả chủ đề' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dialogues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDialogues.map((item, idx) => {
              const isCompleted = completedDialogueIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectDialogue(item)}
                  className={`p-5 rounded-3xl bg-white border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
                    isCompleted
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : 'border-slate-100 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl border border-amber-100">
                          {item.icon}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Bài {idx + 1} • {item.category}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                            {item.titleEn}
                          </h3>
                        </div>
                      </div>

                      {isCompleted && (
                        <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Đã hoàn thành">
                          <CheckCircle className="w-5 h-5" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-500 mb-3 line-clamp-1 italic">
                      {item.titleVi}
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1">
                      <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                        <span className="font-bold text-slate-800">{item.lines[0]?.speaker}:</span> "{item.lines[0]?.text}"
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                        <span className="font-bold text-slate-800">{item.lines[1]?.speaker}:</span> "{item.lines[1]?.text}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{item.lines.length} lượt thoại</span>
                    <span className="text-amber-600 flex items-center gap-1 group">
                      Học ngay <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Dialogue Player View */
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200">
          {/* Top Bar with Back and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <button
              onClick={() => {
                stopSpeaking();
                setActiveDialogue(null);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                title="Bật/Tắt dịch tiếng Việt"
              >
                {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showTranslation ? 'Ẩn nghĩa' : 'Hiện nghĩa'}</span>
              </button>

              <button
                onClick={handlePlayFullDialogue}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95 ${
                  isPlayingAll
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAll ? 'Dừng phát' : 'Nghe toàn bài'}</span>
              </button>
            </div>
          </div>

          {/* Dialogue Header Info */}
          <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
                {activeDialogue.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  {activeDialogue.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeDialogue.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 italic">
                  {activeDialogue.titleVi}
                </p>
              </div>
            </div>

            {/* Role selection for fun interactive practice */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium px-2">Đóng vai:</span>
              <button
                onClick={() => setSelectedRole(null)}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                  selectedRole === null
                    ? 'bg-white shadow-xs text-slate-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả
              </button>
              {Array.from(new Set(activeDialogue.lines.map(l => l.speaker))).map(spk => (
                <button
                  key={spk}
                  onClick={() => setSelectedRole(spk)}
                  className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
                    selectedRole === spk
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {spk}
                </button>
              ))}
            </div>
          </div>

          {/* Hint badge: Clicking word opens Flashcard */}
          <div className="mb-5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              💡 <strong>Mẹo cho bé:</strong> Chạm vào <u>bất kỳ từ tiếng Anh nào</u> trong cuộc hội thoại để mở xem <strong>Flashcard</strong> của từ đó ngay lập tức!
            </span>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-4 py-2">
            {activeDialogue.lines.map((line, idx) => {
              const isCurrent = currentLineIndex === idx;
              const isRoleUser = selectedRole === line.speaker;

              return (
                <div
                  key={line.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300'
                      : isRoleUser
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                        {line.avatar}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          {line.speaker}
                          {isRoleUser && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                              Vai của bé
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayLine(line, idx)}
                      className="p-2 rounded-xl bg-white hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 shadow-xs transition-colors"
                      title="Nghe câu này"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* English line with interactive word buttons */}
                  <div className="mt-3 text-base sm:text-lg font-semibold text-slate-900 leading-relaxed pl-12">
                    {renderInteractiveSentence(line.text)}
                  </div>

                  {/* Vietnamese translation */}
                  {showTranslation && (
                    <div className="mt-2 text-xs sm:text-sm text-slate-500 pl-12 italic border-t border-slate-200/50 pt-1.5">
                      {line.vi}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Complete Dialogue Button */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Đã học xong đoạn hội thoại này chưa? Bấm hoàn thành để lưu điểm nhé!
            </span>

            <button
              onClick={() => handleFinishDialogue(activeDialogue)}
              className={`py-3 px-5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
                completedDialogueIds.includes(activeDialogue.id)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                {completedDialogueIds.includes(activeDialogue.id)
                  ? 'Đã hoàn thành bài này ⭐'
                  : 'Đánh dấu Đã Học Xong!'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
