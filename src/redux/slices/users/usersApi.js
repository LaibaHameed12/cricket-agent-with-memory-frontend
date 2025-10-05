// src/redux/slices/users/usersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Profile", "User"],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => "/users/me",
            providesTags: (result) =>
                result ? [{ type: "Profile", id: result._id }] : ["Profile"],
        })
    }),
});

export const {
    useGetProfileQuery,
} = usersApi;
