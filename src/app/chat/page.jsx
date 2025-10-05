// app/chat/page.jsx
'use client';
import React from 'react';
import ChatList from '@/components/ChatList';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/Components/ProtectedRoute';

export default function ChatsPage() {
    const router = useRouter();

    return (
        <ProtectedRoute authRequired={true} >  
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <ChatList onSelect={(chatId) => router.push(`/chat/${chatId}`)} />
            <div className="flex-1 p-10 flex items-center justify-center">
                <div className="text-center max-w-xl">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                        <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Analyze</h2>
                    <p className="text-slate-400 text-lg">
                        Create a new chat session or select an existing one to start exploring cricket data insights.
                    </p>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}