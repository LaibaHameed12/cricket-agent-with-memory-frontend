// app/page.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '@/redux/slices/auth/authSlice';

export default function Home() {
  const router = useRouter();
  const loggedIn = useSelector(isAuthenticated);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-3xl w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-10 relative z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Cricket Data Agent
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4"></div>
          <p className="text-slate-300 text-lg">
            Unlock insights from cricket data — analyze team stats, matches, trends and make powerful comparisons with AI.
          </p>
        </div>

        {loggedIn ? (
          <div className="space-y-4">
            <button
              onClick={() => router.push('/chat')}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold relative overflow-hidden group cursor-pointer border-none"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
            >
              <span className="relative z-10">Start Analysis Session</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/login')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold cursor-pointer border-none relative overflow-hidden group"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
            >
              <span className="relative z-10">Log in</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="flex-1 px-6 py-4 bg-slate-700/50 border border-slate-600 text-slate-200 font-semibold cursor-pointer hover:bg-slate-700 transition-colors duration-300"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}