"use client";
import React from 'react';
import { AuthProvider as ReactAuthProvider, useSession as useAuthSession } from '@/context/AuthContext';
export function AuthProvider({ children }) {
    return <ReactAuthProvider>{children}</ReactAuthProvider>;
}
export function useSession() {
    return useAuthSession();
}
