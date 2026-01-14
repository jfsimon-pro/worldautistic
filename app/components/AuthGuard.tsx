'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
    const { loading, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Se não está autenticado, redireciona para login
            if (!isAuthenticated) {
                router.push('/signIn');
                return;
            }

            // Se requer admin mas não é admin, redireciona para home
            if (requireAdmin && !isAdmin) {
                router.push('/home');
                return;
            }
        }
    }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#60A5FA',
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                }}>
                    <div style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                    }}>🧩</div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                    }}>Carregando...</div>
                </div>
            </div>
        );
    }

    // Se não está autenticado ou não tem permissão, não renderiza nada
    // (o useEffect vai redirecionar)
    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
        return null;
    }

    // Se passou por todas as verificações, renderiza o conteúdo
    return <>{children}</>;
}
