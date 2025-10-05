"use client";

import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/validations/authSchema";
import { useLoginMutation } from "@/redux/slices/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Home, UserPlus } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/Components/ProtectedRoute';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginMutation()
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await loginUser(data).unwrap();
            dispatch(setCredentials({ token: res.token, user: res.user }));
            router.push("/");
        } catch (err) {
            setError(err?.data?.message || 'invalid credentials');
        }
    };

    return (
        <ProtectedRoute authRequired={false}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
                </div>

                <div className="w-full max-w-sm sm:max-w-md relative z-10">
                    {/* Navigation Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <Link
                            href={'/'}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
                        >
                            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Home</span>
                        </Link>
                    </div>

                    {/* Login Card */}
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-6 sm:p-8 relative overflow-hidden" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)'}}>
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm sm:text-base">Access your cricket data insights</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border-l-4 border-red-400 p-3 mb-4 backdrop-blur-sm" style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'}}>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email", { required: "Email is required" })}
                                    className="w-full px-4 py-3 sm:py-4 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all text-sm sm:text-base cursor-text"
                                    style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)'}}
                                    autoFocus
                                />
                                {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-2 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Password is required" })}
                                    className="w-full px-4 py-3 sm:py-4 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all text-sm sm:text-base cursor-text"
                                    style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)'}}
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2 ml-1">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full min-h-[44px] sm:min-h-[52px] bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base relative overflow-hidden group"
                                style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)'}}
                            >
                                <span className="relative z-10">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        {/* Navigation Links */}
                        <div className="mt-6 sm:mt-8 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                <span>Don't have an account?</span>
                                <Link href={'/register'}
                                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-xs">
                            Secure authentication powered by Cricket Data Agent
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default Login