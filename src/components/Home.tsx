import { Shield, Target, Zap, Users } from 'lucide-react';
import type { Page } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#006B3F] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="size-8" />
              <span className="text-xl">{t('nav.title')}</span>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-2 bg-white text-[#006B3F] rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('nav.login')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#006B3F] to-[#009B55] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t('home.hero.subtitle')}
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-white text-[#006B3F] rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              {t('home.hero.cta')}
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-4xl mb-12">{t('home.features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200 hover:border-[#006B3F] transition-colors">
              <div className="bg-[#006B3F] text-white rounded-full size-16 flex items-center justify-center mb-6">
                <Target className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">{t('home.features.accident.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.accident.description')}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>{t('home.features.accident.list1')}</li>
                <li>{t('home.features.accident.list2')}</li>
                <li>{t('home.features.accident.list3')}</li>
                <li>{t('home.features.accident.list4')}</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200 hover:border-[#006B3F] transition-colors">
              <div className="bg-[#006B3F] text-white rounded-full size-16 flex items-center justify-center mb-6">
                <Zap className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">{t('home.features.emergency.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.emergency.description')}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>{t('home.features.emergency.list1')}</li>
                <li>{t('home.features.emergency.list2')}</li>
                <li>{t('home.features.emergency.list3')}</li>
                <li>{t('home.features.emergency.list4')}</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200 hover:border-[#006B3F] transition-colors">
              <div className="bg-[#006B3F] text-white rounded-full size-16 flex items-center justify-center mb-6">
                <Shield className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">{t('home.features.cyber.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.cyber.description')}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>{t('home.features.cyber.list1')}</li>
                <li>{t('home.features.cyber.list2')}</li>
                <li>{t('home.features.cyber.list3')}</li>
                <li>{t('home.features.cyber.list4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-4xl mb-12">{t('home.stats.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl text-[#006B3F] mb-4">{t('home.stats.stat1')}</div>
              <p className="text-gray-700">{t('home.stats.stat1.text')}</p>
            </div>
            <div>
              <div className="text-5xl text-[#006B3F] mb-4">{t('home.stats.stat2')}</div>
              <p className="text-gray-700">{t('home.stats.stat2.text')}</p>
            </div>
            <div>
              <div className="text-5xl text-[#006B3F] mb-4">{t('home.stats.stat3')}</div>
              <p className="text-gray-700">{t('home.stats.stat3.text')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#006B3F] text-white">
        <div className="container mx-auto px-6 text-center">
          <Users className="size-16 mx-auto mb-6" />
          <h2 className="text-4xl mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-4 bg-white text-[#006B3F] rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            {t('home.cta.button')}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            {t('home.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
