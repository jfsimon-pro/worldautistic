'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscriptionGuardProps {
    children: React.ReactNode;
    userId: string;
}

/**
 * Guard para verificar se usuário tem assinatura ativa
 * Complementa o AuthGuard verificando especificamente o status da assinatura
 */
export default function SubscriptionGuard({ children, userId }: SubscriptionGuardProps) {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkSubscription() {
            try {
                const response = await fetch(`/api/subscription/check?userId=${userId}`);
                const data = await response.json();

                setHasAccess(data.hasAccess);
                setExpiresAt(data.expiresAt ? new Date(data.expiresAt) : null);

                if (!data.hasAccess) {
                    // Redirecionar para página de renovação/upgrade
                    router.push('/subscription/expired');
                }
            } catch (error) {
                console.error('Erro ao verificar assinatura:', error);
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        }

        checkSubscription();
    }, [userId, router]);

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
                    }}>🔐</div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                    }}>Verificando acesso...</div>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#1F2937',
                color: 'white',
                padding: '2rem',
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}>🔒</div>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                    }}>Acesso Expirado</h1>
                    <p style={{
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        opacity: 0.9,
                    }}>
                        Sua assinatura expirou ou foi cancelada.
                        Para continuar usando o app, renove seu acesso.
                    </p>
                    <button
                        onClick={() => router.push('/subscription/renew')}
                        style={{
                            backgroundColor: '#10B981',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '0.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Renovar Acesso
                    </button>
                </div>
            </div>
        );
    }

    // Mostrar aviso se estiver perto de expirar (7 dias)
    const daysUntilExpiration = expiresAt
        ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <>
            {daysUntilExpiration && daysUntilExpiration <= 7 && daysUntilExpiration > 0 && (
                <div style={{
                    backgroundColor: '#FCD34D',
                    color: '#78350F',
                    padding: '1rem',
                    textAlign: 'center',
                    fontWeight: 600,
                }}>
                    ⚠️ Sua assinatura expira em {daysUntilExpiration} dia{daysUntilExpiration !== 1 ? 's' : ''}!
                    <button
                        onClick={() => router.push('/subscription/renew')}
                        style={{
                            marginLeft: '1rem',
                            backgroundColor: '#78350F',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Renovar Agora
                    </button>
                </div>
            )}
            {children}
        </>
    );
}
