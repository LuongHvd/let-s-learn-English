// Speech synthesis helper for clear, child-friendly English pronunciation

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakEnglish(text: string, rate: number = 0.82) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from punctuation if it's a single word
  const cleanText = text.replace(/[/\\#,+()$~%.'":*?<>{}]/g, ' ').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = rate; // Slightly slower for children to hear clearly
  utterance.pitch = 1.05; // Slightly warm/friendly pitch

  // Try to pick a natural high-quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) &&
         (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aaron') || v.name.includes('English'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
