'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    language: string;
    soundEnabled: boolean;
    hasTelegramAccess: boolean;
    avatar: string | null;
    dateOfBirth: string | null;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
}


export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetchUser();
    }, [pathname]);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include', // Incluir cookies
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Expires': '0'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);

                // Verificar e atualizar streak diário
                checkDailyStreak();
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const checkDailyStreak = async () => {
        try {
            // Chama API para verificar/atualizar streak
            // Silencioso - não bloqueia o app se falhar
            await fetch('/api/check-daily-streak', {
                method: 'POST',
                credentials: 'include',
            });
            console.log('✅ Streak diário verificado');
        } catch (error) {
            // Ignora erro - streak não é crítico
            console.log('⚠️ Erro ao verificar streak, mas app continua');
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            setUser(null);
            router.push('/signIn');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, redireciona
            setUser(null);
            router.push('/signIn');
        }
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'ADMIN';

    return {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        logout,
    };
}
