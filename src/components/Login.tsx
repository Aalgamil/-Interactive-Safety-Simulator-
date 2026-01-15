import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Page } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface LoginProps {
  onLogin: (username: string, email: string, user?: any) => void;
  onNavigate: (page: Page) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; fullName?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string; fullName?: string } = {};

    if (!username.trim()) {
      newErrors.username = t('login.username.required');
    } else if (username.trim().length < 3) {
      newErrors.username = t('login.username.minlength');
    }

    if (!isLogin) {
      if (!email.trim()) {
        newErrors.email = t('login.email.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = t('login.email.invalid');
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsLoading(true);

    if (validateForm()) {
      try {
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const body = isLogin
          ? { username, password }
          : { username, email, password, fullName };

        console.log('Sending request to:', endpoint, 'with body:', body);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok) {
          setSuccessMessage(isLogin ? 'Login successful!' : 'Registration successful!');
          setTimeout(() => {
            if (isLogin) {
              onLogin(data.user.username, data.user.email, data.user);
            } else {
              // After registration, switch to login mode
              setIsLogin(true);
              setPassword('');
              setFullName('');
              setSuccessMessage('Registration successful! Please login.');
            }
          }, 500);
        } else {
          setErrors({ username: data.error });
        }
      } catch (error) {
        setErrors({ username: 'Network error. Please try again.' });
      }
    }
    setIsLoading(false);
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={t('login.username.placeholder')}
                />
                {errors.username && (
                  <p className="mt-2 text-red-600">{errors.username}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="fullName" className="block mb-2 text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) {
                          setErrors({ ...errors, fullName: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-red-600">{errors.fullName}</p>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder={t('login.email.placeholder')}
                    />
                    {errors.email && (
                      <p className="mt-2 text-red-600">{errors.email}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block mb-2 text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#006B3F] text-white rounded-lg hover:bg-[#005530] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setSuccessMessage('');
                  setEmail('');
                  setFullName('');
                  setPassword('');
                }}
                className="text-[#006B3F] hover:underline"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>

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
