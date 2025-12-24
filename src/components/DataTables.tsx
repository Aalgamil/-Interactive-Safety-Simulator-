
import { useState } from 'react';
import { BarChart3, Trophy } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { AnalyticsTable } from './AnalyticsTable';
import type { Page } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface DataTablesProps {
  onNavigate: (page: Page) => void;
}

export function DataTables({ onNavigate }: DataTablesProps) {
  useLanguage();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analytics'>('leaderboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#006B3F] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="size-8" />
              <span className="text-xl">Data Tables</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Data Analytics</h1>
            <p className="text-gray-600">View and analyze safety simulator data</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'leaderboard'
                    ? 'border-[#006B3F] text-[#006B3F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy size={18} />
                  Leaderboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                    ? 'border-[#006B3F] text-[#006B3F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Analytics
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'leaderboard' && <LeaderboardTable />}
            {activeTab === 'analytics' && <AnalyticsTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
