import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Page } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface LoginProps {
  onLogin: (username: string, email: string) => void;
  onNavigate: (page: Page) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: { username?: string; email?: string } = {};

    if (!username.trim()) {
      newErrors.username = t('login.username.required');
    } else if (username.trim().length < 3) {
      newErrors.username = t('login.username.minlength');
    }

    if (!email.trim()) {
      newErrors.email = t('login.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.email.invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validateForm()) {
      setSuccessMessage(t('login.success'));
      setTimeout(() => {
        onLogin(username, email);
      }, 500);
    }
  };

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
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="size-4" />
                {t('nav.back')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-[#006B3F] text-white rounded-full size-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8" />
              </div>
              <h1 className="text-3xl mb-2">{t('login.welcome')}</h1>
              <p className="text-gray-600">{t('login.subtitle')}</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block mb-2 text-gray-700">
                  {t('login.username')}
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors({ ...errors, username: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('login.username.placeholder')}
                />
                {errors.username && (
                  <p className="mt-2 text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('login.email.placeholder')}
                />
                {errors.email && (
                  <p className="mt-2 text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors"
              >
                {t('login.submit')}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                {t('login.note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
