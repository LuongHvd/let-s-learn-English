import React from 'react';
import { Trophy, Flame, BookOpen, MessageCircle, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';
import { WORDS_DICTIONARY, VOCABULARY_CATEGORIES } from '../data/words';
import { DIALOGUES } from '../data/dialogues';
import { UserProgressData } from '../firebase/config';

interface Props {
  progress: UserProgressData;
  userEmail?: string | null;
  userName?: string | null;
}

export const ProgressDashboard: React.FC<Props> = ({
  progress,
  userEmail,
  userName,
}) => {
  const totalWords = WORDS_DICTIONARY.length;
  const learnedCount = progress.learnedWordIds.length;
  const wordPercentage = Math.round((learnedCount / totalWords) * 100);

  const totalDialogues = DIALOGUES.length;
  const completedDialoguesCount = progress.completedDialogueIds.length;
  const dialoguePercentage = Math.round((completedDialoguesCount / totalDialogues) * 100);

  // Generate 7-day activity data for the bar chart
  const last7Days = React.useMemo(() => {
    const days: { dateStr: string; label: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const label = dayNames[d.getDay()];
      const count = progress.dailyStats[iso] || (i === 0 ? Math.max(progress.dailyStats[iso] || 0, learnedCount > 0 ? 5 : 0) : 0);
      days.push({ dateStr: iso, label, count });
    }
    return days;
  }, [progress.dailyStats, learnedCount]);

  const maxDailyCount = Math.max(10, ...last7Days.map(d => d.count));

  // Category breakdown calculation
  const categoryStats = VOCABULARY_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const wordsInCat = WORDS_DICTIONARY.filter(w => w.categoryEn === cat.id);
    const learnedInCat = wordsInCat.filter(w => progress.learnedWordIds.includes(w.id)).length;
    const pct = wordsInCat.length > 0 ? Math.round((learnedInCat / wordsInCat.length) * 100) : 0;
    return {
      ...cat,
      total: wordsInCat.length,
      learned: learnedInCat,
      pct,
    };
  });

  // Achievements
  const badges = [
    {
      id: 'first_word',
      title: 'Bước Đầu Tiên',
      desc: 'Học từ vựng đầu tiên',
      icon: '🌱',
      unlocked: learnedCount >= 1,
    },
    {
      id: 'words_10',
      title: 'Ngôi Sao Chăm Chỉ',
      desc: 'Thuộc từ 10 từ trở lên',
      icon: '⭐',
      unlocked: learnedCount >= 10,
    },
    {
      id: 'words_30',
      title: 'Nhà Thám Hiểm Từ',
      desc: 'Thuộc 30 từ vựng',
      icon: '🚀',
      unlocked: learnedCount >= 30,
    },
    {
      id: 'words_50',
      title: 'Bậc Thầy Flashcard',
      desc: 'Thuộc hơn một nửa từ điển',
      icon: '👑',
      unlocked: learnedCount >= 50,
    },
    {
      id: 'first_dialogue',
      title: 'Người Kể Chuyện',
      desc: 'Hoàn thành 1 đoạn hội thoại',
      icon: '💬',
      unlocked: completedDialoguesCount >= 1,
    },
    {
      id: 'dialogue_5',
      title: 'Nhà Diễn Thuyết Nhí',
      desc: 'Hoàn thành 5 đoạn hội thoại',
      icon: '🎭',
      unlocked: completedDialoguesCount >= 5,
    },
    {
      id: 'streak_3',
      title: 'Ngọn Lửa Kiên Trì',
      desc: 'Duy trì học liên tục 3 ngày',
      icon: '🔥',
      unlocked: progress.streak >= 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>📊</span> Bảng Theo Dõi Quy Trình Học Tập Của Bé
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Ghi nhận tiến trình học từ vựng, hội thoại và chuỗi ngày chăm chỉ mỗi ngày.
          </p>
        </div>

        {userName && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tài khoản: <strong>{userName}</strong></span>
          </div>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Words Learned */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Từ Vựng Đã Thuộc</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-base">
              📖
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{learnedCount}</span>
              <span className="text-sm font-semibold text-slate-400">/ {totalWords}</span>
            </div>
            {/* mini progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 mt-3 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${wordPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-2">
            Đạt {wordPercentage}% kho từ điển
          </span>
        </div>

        {/* Card 2: Dialogues */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hội Thoại Đã Học</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-base">
              💬
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{completedDialoguesCount}</span>
              <span className="text-sm font-semibold text-slate-400">/ {totalDialogues}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 mt-3 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${dialoguePercentage}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 mt-2">
            Đạt {dialoguePercentage}% cuộc hội thoại
          </span>
        </div>

        {/* Card 3: Streak */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chuỗi Ngày Học</span>
            <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base">
              🔥
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{progress.streak || 1}</span>
              <span className="text-sm font-semibold text-slate-500">ngày</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">Học đều đặn mỗi ngày</p>
          </div>
          <span className="text-[11px] font-semibold text-orange-600 mt-2">
            Giữ vững thói quen tốt!
          </span>
        </div>

        {/* Card 4: Total Reviews */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lượt Luyện Thẻ</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
              🎯
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">{progress.totalReviewCount || 0}</span>
              <span className="text-sm font-semibold text-slate-500">lần</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">Ôn tập củng cố trí nhớ</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-2">
            Trí nhớ siêu đẳng!
          </span>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 7-Day Activity Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span>Hoạt Động 7 Ngày Gần Nhất</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Số lượng từ vựng bé đã luyện tập qua từng ngày</p>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-6 pb-2">
              <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {last7Days.map((d, idx) => {
                  const heightPercent = Math.max(12, Math.round((d.count / maxDailyCount) * 100));
                  const isToday = idx === last7Days.length - 1;

                  return (
                    <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-600">{d.count}</span>
                      <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-32">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isToday ? 'bg-amber-500' : 'bg-amber-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${isToday ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Cột màu đậm là ngày hôm nay</span>
            <span className="font-semibold text-amber-700">Tiếp tục phát huy nhé!</span>
          </div>
        </div>

        {/* Chart 2: Category Mastery Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🎨</span>
                  <span>Tiến Độ Theo Từng Chủ Đề Từ Vựng</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ từ đã thuộc theo từng nhóm quen thuộc</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-1">
              {categoryStats.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-slate-500">
                      <strong>{cat.learned}</strong> / {cat.total} từ ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.pct >= 80
                          ? 'bg-emerald-500'
                          : cat.pct >= 40
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between mt-4">
            <span>Màu xanh: đã thuộc &gt;80%</span>
            <span className="text-emerald-700 font-semibold">Càng học càng giỏi</span>
          </div>
        </div>
      </div>

      {/* Badges / Achievements Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Huy Hiệu Thành Tích Của Bé</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mỗi bước tiến bộ đều được ghi nhận bằng một huy hiệu lấp lánh!
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {badges.filter(b => b.unlocked).length} / {badges.length} đã mở
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{b.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{b.desc}</p>
              <div className="mt-2 text-[10px] font-bold">
                {b.unlocked ? (
                  <span className="text-emerald-700">Đã đạt ⭐</span>
                ) : (
                  <span className="text-slate-400">Chưa mở</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
