import React from 'react';
import { BookOpen, Sparkles, MessageSquare, BarChart3, LogIn, LogOut, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

export type ActiveTab = 'dictionary' | 'flashcards' | 'dialogues' | 'progress';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing: boolean;
  learnedCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSignIn,
  onSignOut,
  isSyncing,
  learnedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('flashcards')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Kiddo<span className="text-amber-500">English</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Bé Học Tiếng Anh
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Đơn giản • Trực quan • Dễ nhớ</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'dictionary'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Từ Điển 100 Từ</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Học Flashcard</span>
            </button>

            <button
              onClick={() => setActiveTab('dialogues')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'dialogues'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>20 Cuộc Hội Thoại</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'progress'
                  ? 'bg-white shadow-xs text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Tiến Độ</span>
            </button>
          </nav>

          {/* User Auth & Sync Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-2xl">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Avatar'}
                      className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                      {currentUser.displayName ? currentUser.displayName[0] : 'K'}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] sm:max-w-[120px] truncate hidden sm:inline-block">
                    {currentUser.displayName || 'Bé học viên'}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
                    }`}
                    title={isSyncing ? 'Đang đồng bộ...' : 'Đã đồng bộ với Firebase'}
                  />
                </div>

                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all active:scale-95"
              >
                {/* Google "G" icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Đăng nhập Google</span>
                <span className="sm:hidden">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-white grid grid-cols-4 px-2 py-1.5">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex flex-col items-center py-1.5 text-[10px] font-bold ${
            activeTab === 'dictionary' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Từ Điển</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center py-1.5 text-[10px] font-bold ${
            activeTab === 'flashcards' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Flashcard</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogues')}
          className={`flex flex-col items-center py-1.5 text-[10px] font-bold ${
            activeTab === 'dialogues' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>Hội Thoại</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center py-1.5 text-[10px] font-bold ${
            activeTab === 'progress' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Tiến Độ</span>
        </button>
      </div>
    </header>
  );
};
