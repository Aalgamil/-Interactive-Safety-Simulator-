import { Shield, Target, Zap, Trophy, LogOut, User, BarChart3 } from 'lucide-react';
import type { Page, User as UserType } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import './Dashboard.css';

interface DashboardProps {
  user: UserType;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const totalScore = user.scores.accidentSimulation + user.scores.emergencyReporting + user.scores.cybercrimeDetection;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#006B3F] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="size-8" />
              <span className="text-xl">{t('nav.title')}</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <button
                onClick={() => onNavigate('dataTables')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <BarChart3 className="size-4" />
                Data Tables
              </button>
              <div className="flex items-center gap-2">
                <User className="size-5" />
                <span>{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut className="size-4" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl mb-2">{t('dashboard.welcome')}, {user.username}!</h1>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>

          {/* Score Overview */}
          <div className="bg-gradient-to-br from-[#006B3F] to-[#009B55] text-white rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="size-8" />
              <h2 className="text-2xl">{t('dashboard.progress')}</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl mb-1">{totalScore}</div>
                <div className="text-sm opacity-90">{t('dashboard.totalScore')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl mb-1">{user.scores.accidentSimulation}</div>
                <div className="text-sm opacity-90">{t('dashboard.accident.title')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl mb-1">{user.scores.emergencyReporting}</div>
                <div className="text-sm opacity-90">{t('dashboard.emergency.title')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl mb-1">{user.scores.cybercrimeDetection}</div>
                <div className="text-sm opacity-90">{t('dashboard.cyber.title')}</div>
              </div>
            </div>
          </div>

          {/* Training Modules */}
          <div>
            <h2 className="text-2xl mb-6">{t('dashboard.modules')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Accident Simulation */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-[#006B3F] text-white p-6">
                  <Target className="size-12 mb-4" />
                  <h3 className="text-2xl mb-2">{t('dashboard.accident.title')}</h3>
                  <p className="opacity-90">{t('dashboard.accident.description')}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('dashboard.bestScore')}</span>
                      <span className="text-[#006B3F]">{user.scores.accidentSimulation} / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3" style={{ '--progress-width': `${user.scores.accidentSimulation}%` } as any}>
                      <div className="progress-fill" />
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('accident')}
                    className="w-full py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
                  >
                    {t('dashboard.start')}
                  </button>
                </div>
              </div>

              {/* Emergency Reporting Game */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-[#006B3F] text-white p-6">
                  <Zap className="size-12 mb-4" />
                  <h3 className="text-2xl mb-2">{t('dashboard.emergency.title')}</h3>
                  <p className="opacity-90">{t('dashboard.emergency.description')}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('dashboard.bestScore')}</span>
                      <span className="text-[#006B3F]">{user.scores.emergencyReporting} / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3" style={{ '--progress-width': `${user.scores.emergencyReporting}%` } as any}>
                      <div className="progress-fill" />
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('emergency')}
                    className="w-full py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
                  >
                    {t('dashboard.startGame')}
                  </button>
                </div>
              </div>

              {/* Cybercrime Detection */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-[#006B3F] text-white p-6">
                  <Shield className="size-12 mb-4" />
                  <h3 className="text-2xl mb-2">{t('dashboard.cyber.title')}</h3>
                  <p className="opacity-90">{t('dashboard.cyber.description')}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('dashboard.bestScore')}</span>
                      <span className="text-[#006B3F]">{user.scores.cybercrimeDetection} / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3" style={{ '--progress-width': `${user.scores.cybercrimeDetection}%` } as any}>
                      <div className="progress-fill" />
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('cybercrime')}
                    className="w-full py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
                  >
                    {t('dashboard.startDetection')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl mb-4">{t('dashboard.tips')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg mb-2 text-[#006B3F]">{t('dashboard.tips.emergency')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>{t('dashboard.tips.emergency1')}</li>
                  <li>{t('dashboard.tips.emergency2')}</li>
                  <li>{t('dashboard.tips.emergency3')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg mb-2 text-[#006B3F]">{t('dashboard.tips.cyber')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>{t('dashboard.tips.cyber1')}</li>
                  <li>{t('dashboard.tips.cyber2')}</li>
                  <li>{t('dashboard.tips.cyber3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
