import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="size-5" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
