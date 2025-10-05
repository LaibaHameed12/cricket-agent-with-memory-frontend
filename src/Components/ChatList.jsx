// components/ChatList.jsx
'use client';
import React, { useState } from 'react';
import { useGetChatsQuery, useDeleteChatMutation } from '@/redux/slices/chat/chatApi';
import { useRouter } from 'next/navigation';

const ChatList = ({ activeChatId, onSelect }) => {
    const router = useRouter();
    const { data: chats = [], isLoading, error, refetch } = useGetChatsQuery();
    const [deleteChat] = useDeleteChatMutation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    const handleNewChat = () => {
        router.push('/chat/new');
    };

    const openDeleteModal = (chat) => {
        setChatToDelete(chat);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setChatToDelete(null);
    };

    const confirmDelete = async () => {
        if (!chatToDelete) return;
        try {
            await deleteChat(chatToDelete._id).unwrap();
            refetch();
            if (activeChatId === chatToDelete._id && onSelect) onSelect(null);
            router.push('/chat/new');
            closeDeleteModal();
        } catch (err) {
            console.error('Delete chat failed', err);
            closeDeleteModal();
        }
    };

    return (
        <>
            <aside className="w-80 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <h3 className="font-bold text-xl text-white">Sessions</h3>
                    <button
                        onClick={handleNewChat}
                        className="px-4 py-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                    >
                        + New
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20">
                            Error loading chats
                        </div>
                    )}
                    {!isLoading && chats.length === 0 ? (
                        <div className="text-sm text-slate-500 p-4 text-center">
                            No sessions yet — click New to start
                        </div>
                    ) : null}
                    <ul className="mt-2 space-y-2">
                        {chats.map((c) => (
                            <li
                                key={c._id}
                                onClick={() => onSelect?.(c._id)}
                                className={`p-3 cursor-pointer flex items-center justify-between group relative overflow-hidden transition-all duration-200 ${activeChatId === c._id
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-l-4 border-emerald-400'
                                        : 'bg-slate-700/30 hover:bg-slate-700/50 border-l-4 border-transparent'
                                    }`}
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                            >
                                <span className="truncate text-slate-200 font-medium">
                                    {c.title || 'Untitled Session'}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(c);
                                    }}
                                    className="text-sm text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer ml-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-slate-700 shadow-2xl max-w-md w-full p-6 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                        <h3 className="text-xl font-bold text-white mb-3">Delete Session</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete "{chatToDelete?.title || 'Untitled Session'}"? This will remove all messages permanently.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2 bg-slate-700 text-slate-200 font-medium cursor-pointer hover:bg-slate-600 transition-colors duration-200"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatList;