import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AccidentSimulation } from './components/AccidentSimulation';
import { EmergencyReportingGame } from './components/EmergencyReportingGame';
import { CybercrimeGame } from './components/CybercrimeGame';

export type User = {
  id: string;
  username: string;
  email: string;
  scores: {
    accidentSimulation: number;
    emergencyReporting: number;
    cybercrimeDetection: number;
  };
};

export type Page = 'home' | 'login' | 'dashboard' | 'accident' | 'emergency' | 'cybercrime';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (username: string, email: string) => {
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find((u: User) => u.email === email);

    if (!user) {
      // Create new user
      user = {
        id: Date.now().toString(),
        username,
        email,
        scores: {
          accidentSimulation: 0,
          emergencyReporting: 0,
          cybercrimeDetection: 0,
        },
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const updateScore = (gameType: keyof User['scores'], score: number) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      scores: {
        ...currentUser.scores,
        [gameType]: Math.max(currentUser.scores[gameType], score),
      },
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {currentPage === 'home' && (
          <Home onNavigate={navigateTo} />
        )}
        {currentPage === 'login' && (
          <Login onLogin={handleLogin} onNavigate={navigateTo} />
        )}
        {currentPage === 'dashboard' && currentUser && (
          <Dashboard
            user={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )}
        {currentPage === 'accident' && currentUser && (
          <AccidentSimulation
            onComplete={(score) => updateScore('accidentSimulation', score)}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentPage === 'emergency' && currentUser && (
          <EmergencyReportingGame
            onComplete={(score) => updateScore('emergencyReporting', score)}
            onBack={() => navigateTo('dashboard')}
          />
        )}
        {currentPage === 'cybercrime' && currentUser && (
          <CybercrimeGame
            onComplete={(score) => updateScore('cybercrimeDetection', score)}
            onBack={() => navigateTo('dashboard')}
          />
        )}
      </div>
    </LanguageProvider>
  );
}