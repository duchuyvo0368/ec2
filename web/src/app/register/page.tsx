'use client';

import React from 'react';
import Head from 'next/head';
import RegisterForm from './components/RegisterForm';
import { useRegisterGate } from './hooks/useRegisterGate';

export default function LoginPage() {
    const { authChecked, redirectTo } = useRegisterGate();

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-sky-100">
                <p className="text-lg text-gray-700">Checking authentication...</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="description" content="Secure login to your account" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-teal-400 to-teal-700 px-4 py-8">
                <RegisterForm redirectTo={redirectTo} />
            </div>
        </>
    );
}
