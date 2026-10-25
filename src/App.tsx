/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  auth,
  testConnection,
  signInWithGoogle,
  logOut,
  UserProgressData,
  getLocalProgress,
  saveLocalProgress,
  fetchRemoteProgress,
  saveRemoteProgress,
} from './firebase/config';
import { Navbar, ActiveTab } from './components/Navbar';
import { DictionaryBrowser } from './components/DictionaryBrowser';
import { FlashcardViewer } from './components/FlashcardViewer';
import { DialogueViewer } from './components/DialogueViewer';
import { ProgressDashboard } from './components/ProgressDashboard';
import { WordFlashcardModal } from './components/WordFlashcardModal';
import { WordItem } from './data/words';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('flashcards');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<UserProgressData>(getLocalProgress());
  const [selectedWordForModal, setSelectedWordForModal] = useState<WordItem | string | null>(null);
  const [loginNotification, setLoginNotification] = useState<string | null>(null);

  // Connection test on initial mount
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        setIsSyncing(true);
        try {
          const remoteData = await fetchRemoteProgress(user);
          if (remoteData) {
            // Merge with local progress (union of learned words and highest streak)
            const currentLocal = getLocalProgress();
            const merged: UserProgressData = {
              userId: user.uid,
              learnedWordIds: Array.from(new Set([...remoteData.learnedWordIds, ...currentLocal.learnedWordIds])),
              favoriteWordIds: Array.from(new Set([...remoteData.favoriteWordIds, ...currentLocal.favoriteWordIds])),
              completedDialogueIds: Array.from(new Set([...remoteData.completedDialogueIds, ...currentLocal.completedDialogueIds])),
              streak: Math.max(remoteData.streak || 1, currentLocal.streak || 1),
              totalReviewCount: Math.max(remoteData.totalReviewCount || 0, currentLocal.totalReviewCount || 0),
              lastStudyDate: remoteData.lastStudyDate || new Date().toISOString().split('T')[0],
              dailyStats: { ...currentLocal.dailyStats, ...remoteData.dailyStats },
              updatedAt: new Date().toISOString(),
            };
            setProgress(merged);
            saveLocalProgress(merged);
            await saveRemoteProgress(user, merged);
          } else {
            // First time this user logs in: upload local progress to their new cloud profile
            const currentLocal = getLocalProgress();
            const newUserData: UserProgressData = {
              ...currentLocal,
              userId: user.uid,
              updatedAt: new Date().toISOString(),
            };
            setProgress(newUserData);
            await saveRemoteProgress(user, newUserData);
          }
        } catch (err) {
          console.error('Error syncing user progress:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save progress helper
  const updateProgress = useCallback(
    (updater: (prev: UserProgressData) => UserProgressData) => {
      setProgress(prev => {
        const next = updater(prev);
        // Calculate daily streak logic
        const todayStr = new Date().toISOString().split('T')[0];
        let newStreak = next.streak || 1;

        if (next.lastStudyDate !== todayStr) {
          const lastDate = next.lastStudyDate ? new Date(next.lastStudyDate) : null;
          const today = new Date(todayStr);

          if (lastDate) {
            const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          }
          next.lastStudyDate = todayStr;
        }

        next.streak = newStreak;
        next.dailyStats = {
          ...next.dailyStats,
          [todayStr]: (next.dailyStats[todayStr] || 0) + 1,
        };
        next.updatedAt = new Date().toISOString();

        // Save local
        saveLocalProgress(next);

        // Save remote if logged in
        if (currentUser) {
          setIsSyncing(true);
          saveRemoteProgress(currentUser, next)
            .catch(err => console.error('Auto-sync failed:', err))
            .finally(() => setIsSyncing(false));
        }

        return next;
      });
    },
    [currentUser]
  );

  // Toggles
  const handleToggleLearned = useCallback(
    (wordId: string) => {
      updateProgress(prev => {
        const isLearned = prev.learnedWordIds.includes(wordId);
        const newLearned = isLearned
          ? prev.learnedWordIds.filter(id => id !== wordId)
          : [...prev.learnedWordIds, wordId];
        return {
          ...prev,
          learnedWordIds: newLearned,
        };
      });
    },
    [updateProgress]
  );

  const handleToggleFavorite = useCallback(
    (wordId: string) => {
      updateProgress(prev => {
        const isFav = prev.favoriteWordIds.includes(wordId);
        const newFavs = isFav
          ? prev.favoriteWordIds.filter(id => id !== wordId)
          : [...prev.favoriteWordIds, wordId];
        return {
          ...prev,
          favoriteWordIds: newFavs,
        };
      });
    },
    [updateProgress]
  );

  const handleToggleCompleteDialogue = useCallback(
    (dialogueId: string) => {
      updateProgress(prev => {
        const isDone = prev.completedDialogueIds.includes(dialogueId);
        const newDone = isDone
          ? prev.completedDialogueIds.filter(id => id !== dialogueId)
          : [...prev.completedDialogueIds, dialogueId];
        return {
          ...prev,
          completedDialogueIds: newDone,
        };
      });
    },
    [updateProgress]
  );

  const handleIncrementReviewCount = useCallback(() => {
    updateProgress(prev => ({
      ...prev,
      totalReviewCount: (prev.totalReviewCount || 0) + 1,
    }));
  }, [updateProgress]);

  // Auth actions
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setLoginNotification(`Chào mừng ${user.displayName || 'bé'} đã đăng nhập thành công! 🎉`);
        setTimeout(() => setLoginNotification(null), 4000);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Không thể hoàn tất đăng nhập Google lúc này. Vui lòng thử lại sau.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setCurrentUser(null);
      setLoginNotification('Đã đăng xuất tài khoản. Tiến trình vẫn được lưu trên máy của bé!');
      setTimeout(() => setLoginNotification(null), 4000);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isSyncing={isSyncing}
        learnedCount={progress.learnedWordIds.length}
      />

      {/* Notification Toast */}
      {loginNotification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>✨</span>
          <span>{loginNotification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'flashcards' && (
          <FlashcardViewer
            learnedWordIds={progress.learnedWordIds}
            favoriteWordIds={progress.favoriteWordIds}
            onToggleLearned={handleToggleLearned}
            onToggleFavorite={handleToggleFavorite}
            onIncrementReviewCount={handleIncrementReviewCount}
          />
        )}

        {activeTab === 'dialogues' && (
          <DialogueViewer
            completedDialogueIds={progress.completedDialogueIds}
            onToggleCompleteDialogue={handleToggleCompleteDialogue}
            onSelectWord={word => setSelectedWordForModal(word)}
          />
        )}

        {activeTab === 'dictionary' && (
          <DictionaryBrowser
            learnedWordIds={progress.learnedWordIds}
            favoriteWordIds={progress.favoriteWordIds}
            onToggleLearned={handleToggleLearned}
            onToggleFavorite={handleToggleFavorite}
            onSelectWord={item => setSelectedWordForModal(item)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            userEmail={currentUser?.email}
            userName={currentUser?.displayName}
          />
        )}
      </main>

      {/* Interactive Word Flashcard Modal (triggered by clicking ANY word in dialogue or dictionary) */}
      <WordFlashcardModal
        wordTarget={selectedWordForModal}
        onClose={() => setSelectedWordForModal(null)}
        learnedWordIds={progress.learnedWordIds}
        favoriteWordIds={progress.favoriteWordIds}
        onToggleLearned={handleToggleLearned}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">KiddoEnglish</span>
            <span>• Học tiếng Anh vui vẻ & hiệu quả mỗi ngày</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Dự án Firebase: <code>let-s-learn-english-d0e49</code></span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Lưu trữ đám mây tự động</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
