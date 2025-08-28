'use client';

import React, { useState } from 'react';
import { login } from '../auth.service';
import { useRouter, useSearchParams } from 'next/navigation';

interface LoginFormProps {
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login({
        data: { email, password },
        onSuccess: (response) => {
          const { accessToken, refreshToken } = response?.metadata?.tokens || {};
          const user = response?.metadata?.user;

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            if (user) {
              localStorage.setItem('userInfo', JSON.stringify(user));
            }

            setTimeout(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userInfo');
            }, 15 * 60 * 1000);

            router.push(redirectTo);
          } else {
            setError('Login failed: No token received.');
          }
        },
        onError: (err) => {
          setError(err.message || 'Login failed. Please try again.');
        },
      });
    } catch {
      setError('Unexpected error during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <svg className="w-12 h-12 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Login</h2>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Please login to continue.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-300 text-sm rounded-md p-3">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
            isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-teal-600 font-medium hover:underline">
          Register now
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
