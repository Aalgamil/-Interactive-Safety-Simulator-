
import { useState, useEffect } from 'react';
import { BarChart3, Users, Clock } from 'lucide-react';

interface EngagementData {
  date: string;
  active_users: number;
}

interface ModuleData {
  module_type: string;
  session_count: number;
  avg_score: number;
  avg_time: number;
}

export function AnalyticsTable() {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [moduleData, setModuleData] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch engagement data
        const engagementResponse = await fetch('/api/analytics/engagement');
        if (!engagementResponse.ok) {
          throw new Error('Failed to fetch engagement data');
        }
        const engagement = await engagementResponse.json();

        // Fetch module popularity data
        const moduleResponse = await fetch('/api/analytics/popularity');
        if (!moduleResponse.ok) {
          throw new Error('Failed to fetch module data');
        }
        const modules = await moduleResponse.json();

        setEngagementData(engagement);
        setModuleData(modules);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time in seconds to minutes:seconds format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get module icon based on type
  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case 'accident':
        return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-600 font-bold">A</span></div>;
      case 'emergency':
        return <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><span className="text-red-600 font-bold">E</span></div>;
      case 'cybercrime':
        return <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-purple-600 font-bold">C</span></div>;
      default:
        return <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><span className="text-gray-600 font-bold">?</span></div>;
    }
  };

  // Format module type name
  const formatModuleName = (moduleType: string) => {
    switch (moduleType) {
      case 'accident':
        return 'Accident Simulation';
      case 'emergency':
        return 'Emergency Reporting';
      case 'cybercrime':
        return 'Cybercrime Detection';
      default:
        return moduleType;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B3F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Engagement Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#006B3F] text-white p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users size={28} />
            User Engagement (Last 30 Days)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {engagementData.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-[#006B3F] mr-2">
                        {entry.active_users}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#006B3F] h-2 rounded-full"
                          style={{ width: `${Math.min(entry.active_users * 5, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {engagementData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No engagement data available
          </div>
        )}
      </div>

      {/* Module Popularity Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#006B3F] text-white p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={28} />
            Module Popularity & Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moduleData.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getModuleIcon(entry.module_type)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {formatModuleName(entry.module_type)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-[#006B3F] mr-2">
                        {entry.session_count}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#006B3F] h-2 rounded-full"
                          style={{ width: `${Math.min(entry.session_count * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {entry.avg_score ? entry.avg_score.toFixed(1) : 'N/A'}
                      </div>
                      {entry.avg_score && (
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${entry.avg_score}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <div className="text-sm text-gray-900">
                        {entry.avg_time ? formatTime(Math.round(entry.avg_time)) : 'N/A'}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {moduleData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No module data available
          </div>
        )}
      </div>
    </div>
  );
}
