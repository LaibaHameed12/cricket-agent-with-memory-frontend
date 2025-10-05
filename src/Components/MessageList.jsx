// components/MessageList.jsx
'use client';
import React, { useEffect, useRef } from 'react';
import { markdownTableToHtml } from '@/lib/markdownTableToHtml';


export default function MessageList({ messages = [], memorySummary }) {
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-900/50 to-transparent custom-scrollbar">
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(51, 65, 85, 0.3);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #10b981, #06b6d4);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #059669, #0891b2);
                }
            `}</style>

            {memorySummary && (
                <div className="mb-6 p-4 bg-amber-500/10 border-l-4 border-amber-400 backdrop-blur-sm relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                            <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <strong className="text-amber-300 text-sm font-bold uppercase tracking-wide">Context Memory</strong>
                            <p className="text-amber-100 mt-1 text-sm leading-relaxed">{memorySummary}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 max-w-5xl mx-auto">
                {messages.map((m) => (
                    <div
                        key={m._id || Math.random()}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-3xl ${m.role === 'user' ? 'w-auto' : 'w-full'}`}>
                            {/* Role indicator */}
                            <div className={`flex items-center gap-2 mb-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-7 h-7 flex items-center justify-center ${m.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                                    : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                                    }`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    {m.role === 'user' ? (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {m.role === 'user' ? 'You' : 'Agent'}
                                </span>
                            </div>

                            {/* Message bubble */}
                            <div className={`p-4 backdrop-blur-sm relative overflow-hidden group ${m.role === 'user'
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                : 'bg-slate-800/80 border border-slate-700/50 text-slate-100'
                                }`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                                <div className="relative z-10">
                                    {renderMessageContent(m.content)}
                                </div>
                                {/* Subtle hover effect */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${m.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-700 to-purple-700'
                                    : 'bg-slate-800/60'
                                    }`} style={{ zIndex: 0 }}></div>
                            </div>

                            {/* Timestamp */}
                            {m.createdAt && (
                                <div className={`text-xs text-slate-500 mt-2 flex items-center gap-1 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(m.createdAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div ref={endRef} />
        </div>
    );
}

function renderMessageContent(content) {
    if (!content) return null;

    // Step 1: detect JSON array within text
    const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
        try {
            const jsonArray = JSON.parse(jsonMatch[0]);
            if (Array.isArray(jsonArray) && jsonArray.length > 0) {
                // Step 2: convert to markdown table
                const keys = Object.keys(jsonArray[0]).filter(
                    (k) => !["__v", "createdAt", "updatedAt", "_id"].includes(k)
                );

                const header = `| ${keys.join(" | ")} |`;
                const divider = `| ${keys.map(() => "---").join(" | ")} |`;

                const rows = jsonArray.map((obj) => {
                    const row = keys
                        .map((k) => {
                            const val = obj[k];
                            if (val == null) return "";
                            if (typeof val === "object") return JSON.stringify(val);
                            return String(val);
                        })
                        .join(" | ");
                    return `| ${row} |`;
                });

                const markdown = [header, divider, ...rows].join("\n");

                // Step 3: render markdown table to HTML
                const html = markdownTableToHtml(markdown);
                return (
                    <div className="overflow-x-auto">
                        {/* Keep any text before JSON visible */}
                        {content.split("[")[0].trim() && (
                            <p className="mb-2 text-slate-300">
                                {content.split("[")[0].trim()}
                            </p>
                        )}
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                );
            }
        } catch (err) {
            console.error("Error parsing JSON in message:", err);
        }
    }

    // Step 4: fallback — handle markdown tables normally
    const firstLine = content.split("\n")[0] || "";
    if (firstLine.trim().startsWith("|")) {
        const html = markdownTableToHtml(content);
        return <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Step 5: fallback plain text
    return (
        <div className="space-y-2">
            {content.split("\n").map((line, i) => (
                <div key={i} className="leading-relaxed whitespace-pre-wrap break-words">
                    {line || <br />}
                </div>
            ))}
        </div>
    );
}