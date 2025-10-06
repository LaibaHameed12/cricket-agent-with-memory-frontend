// src/app/chat/[id]/page.jsx
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    useGetMessagesQuery,
    useGetSummariesQuery,
} from '@/redux/slices/chat/chatApi';
import ChatList from '@/Components/ChatList';
import MessageList from '@/Components/MessageList';
import MessageInput from '@/Components/MessageInput';
import ProtectedRoute from '@/Components/ProtectedRoute';

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const chatId = params?.id || null;
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const skipMessages = !chatId || chatId === 'new';

    const {
        data: fetchedMessages,
        refetch: refetchMessages,
        isFetching,
    } = useGetMessagesQuery(chatId, { skip: skipMessages });

    const { data: summaries = [] } = useGetSummariesQuery(chatId, {
        skip: skipMessages,
    });

    const [optimisticMessages, setOptimisticMessages] = useState([]);
    const [stableFetched, setStableFetched] = useState([]);
    const [lastMemorySummary, setLastMemorySummary] = useState(null);

    useEffect(() => {
        if (fetchedMessages && fetchedMessages.length >= 0) {
            setStableFetched(fetchedMessages);
        }
    }, [fetchedMessages]);

    const allMessages = useMemo(() => {
        return [...stableFetched, ...optimisticMessages];
    }, [stableFetched, optimisticMessages]);

    useEffect(() => {
        if (summaries && summaries.length > 0) {
            setLastMemorySummary(summaries[0].summaryText);
        } else {
            setLastMemorySummary(null);
        }
    }, [summaries]);

    const handleOptimisticAdd = useCallback((userMsg, assistantMsg) => {
        setOptimisticMessages((prev) => [...prev, userMsg, assistantMsg]);
    }, []);

    const handleRefetch = useCallback(async () => {
        if (!skipMessages) {
            const res = await refetchMessages();
            if (res?.data) {
                setStableFetched(res.data);
                setOptimisticMessages([]);
            }
        } else {
            setOptimisticMessages([]);
        }
    }, [skipMessages, refetchMessages]);

    return (
        <ProtectedRoute authRequired={true} >  
        <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            <ChatList
                onSelect={(id) => router.push(`/chat/${id}`)}
                activeChatId={chatId}
            />

            <div className="flex-1 flex flex-col h-screen">
                {/* Header */}
                <div className="border-b border-slate-700/50 p-6 bg-slate-800/40 backdrop-blur-xl flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Cricket Data Agent</h2>
                    </div>
                    <div className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm font-medium" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)'}}>
                        {chatId && chatId !== 'new' ? `Session ID: ${chatId.slice(-8)}` : 'New Session'}
                    </div>
                </div>

                <MessageList
                    messages={allMessages}
                    memorySummary={lastMemorySummary}
                />

                <MessageInput
                    chatId={chatId}
                    onOptimisticAdd={handleOptimisticAdd}
                    onRefetch={handleRefetch}
                    isAnalyzing={isAnalyzing}
                    setIsAnalyzing={setIsAnalyzing}
                />
            </div>
        </div>
        </ProtectedRoute>
    );
}