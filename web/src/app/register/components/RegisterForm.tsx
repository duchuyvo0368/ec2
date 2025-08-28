/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRegisterForm } from '../hooks/useRegisterForm';

interface RegisterFormProps {
    redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ redirectTo = '/' }) => {
    const { name, setName, email, setEmail, password, setPassword, error, isLoading, handleSubmit } = useRegisterForm(redirectTo);

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Register</h2>
                <p className="mt-1 text-sm text-gray-500">Create an account to continue.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                    className={`w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-teal-600 font-medium hover:underline">
                    Sign in
                </a>
            </p>
        </div>
    );
};

export default RegisterForm;
