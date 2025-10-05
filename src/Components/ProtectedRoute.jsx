'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from '@/redux/slices/auth/authSlice';

/**
 * Props:
 * - authRequired (boolean) default true: whether the route requires authentication
 * - allowedRoles (array | null) default null: e.g. ['admin','superadmin'] to restrict access
 *
 * Usage examples:
 * <ProtectedRoute authRequired={true} allowedRoles={['admin','superadmin']}>...</ProtectedRoute>
 * <ProtectedRoute authRequired={false}> // public but redirect logged-in users away (to / or /dashboard)
 */
export default function ProtectedRoute({ children, authRequired = true }) {
    const router = useRouter();
    const loggedIn = useSelector(isAuthenticated);
    const user = useSelector(getUser);
    const [checked, setChecked] = useState(false);


    useEffect(() => {
        // Not authenticated but this page requires auth -> send to login
        if (authRequired && !loggedIn) {
            router.replace('/login');
            return;
        }

        // Public page (authRequired=false) but user is already logged in -> redirect them
        if (!authRequired && loggedIn) {
            router.replace('/');
            return;
        }

        // All checks passed — allow render
        setChecked(true);
    }, [authRequired, loggedIn, router]);

    // Render nothing until redirect/check is complete
    if (!checked) return null;

    return <>{children}</>;
}
