'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/v1/api/user', {
          withCredentials: true,
          params: { page: 1, limit: 10 },
        });

        if (res.data?.metadata?.results?.length > 0) {
          router.replace(redirectTo);
        } else {
          setAuthChecked(true);
        }
      } catch {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [redirectTo, router]);

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
        <title>Login</title>
        <meta name="description" content="Secure login to your account" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-teal-400 to-teal-700 px-4 py-8">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </>
  );
}
