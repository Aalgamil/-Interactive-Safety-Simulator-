
import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  full_name: string;
  overall_best_score: number;
  total_sessions: number;
  accident_best_score: number;
  emergency_best_score: number;
  cybercrime_best_score: number;
  last_activity: string;
}

export function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard');

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        setLeaderboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to get rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-gray-600 font-medium">{rank}</span>;
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#006B3F] text-white p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy size={28} />
            Safety Simulator Leaderboard
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Leaderboard temporarily unavailable</p>
            <p className="text-sm text-gray-400 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#006B3F] text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy size={28} />
          Safety Simulator Leaderboard
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accident Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emergency Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cybercrime Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((entry, index) => (
              <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {entry.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.full_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-[#006B3F]">
                    {entry.overall_best_score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {entry.accident_best_score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {entry.emergency_best_score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {entry.cybercrime_best_score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {entry.total_sessions}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.last_activity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leaderboardData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No leaderboard data available
        </div>
      )}
    </div>
  );
}
