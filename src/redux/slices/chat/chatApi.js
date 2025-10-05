// src/redux/slices/chat/chatApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            try {
                const token = getState().auth?.token || (typeof window !== 'undefined' && localStorage.getItem('token'));
                if (token) headers.set('Authorization', `Bearer ${token}`);
            } catch (err) { /* no-op */ }
            return headers;
        },
    }),
    tagTypes: ['Chat', 'Messages', 'Summary'],
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({ url: 'chat', method: 'GET' }),
            providesTags: (result) =>
                result
                    ? [{ type: 'Chat', id: 'LIST' }, ...result.map((c) => ({ type: 'Chat', id: c._id }))]
                    : [{ type: 'Chat', id: 'LIST' }],
        }),
        createChat: builder.mutation({
            query: ({ title }) => ({ url: 'chat', method: 'POST', body: { title } }),
            invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({ url: `chat/${chatId}`, method: 'DELETE' }),
            invalidatesTags: (result, error, chatId) => [
                { type: 'Chat', id: 'LIST' },
                { type: 'Messages', id: chatId },
                { type: 'Summary', id: chatId },
            ],
        }),
        getMessages: builder.query({
            query: (chatId) => ({ url: `chat/${chatId}/messages`, method: 'GET' }),
            providesTags: (result, error, chatId) => [{ type: 'Messages', id: chatId }],
        }),
        getSummaries: builder.query({
            query: (chatId) => ({ url: `chat/${chatId}/summaries`, method: 'GET' }),
            providesTags: (result, error, chatId) => [{ type: 'Summary', id: chatId }],
        }),
        askWorkflow: builder.mutation({
            query: ({ chatId, question }) => ({ url: 'workflow/ask', method: 'POST', body: { chatId, question } }),
            invalidatesTags: (result, error, { chatId }) => [
                { type: 'Messages', id: chatId },
                { type: 'Summary', id: chatId },
            ],
        }),
    }),
});

export const {
    useGetChatsQuery,
    useCreateChatMutation,
    useDeleteChatMutation,
    useGetMessagesQuery,
    useGetSummariesQuery,
    useAskWorkflowMutation,
} = chatApi;
export default chatApi;
