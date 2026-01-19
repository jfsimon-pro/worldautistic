'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Purchase {
    id: string;
    hotmartTransactionId: string;
    productName: string;
    buyerEmail: string;
    buyerName: string;
    amount: number;
    currency: string;
    status: string;
    purchaseDate: string;
    isRecurrent: boolean;
    user: {
        id: string;
        email: string;
        name: string;
        subscriptionStatus: string | null;
        hasActiveSubscription: boolean;
    };
}

export default function PurchasesAdminPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const router = useRouter();

    useEffect(() => {
        loadPurchases();
    }, [filter]);

    async function loadPurchases() {
        try {
            setLoading(true);
            const url = filter === 'all'
                ? '/api/admin/purchases'
                : `/api/admin/purchases?status=${filter}`;

            const response = await fetch(url);
            const data = await response.json();
            setPurchases(data.purchases || []);
        } catch (error) {
            console.error('Erro ao carregar compras:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(purchaseId: string, action: 'activate' | 'deactivate') {
        if (!confirm(`Tem certeza que deseja ${action === 'activate' ? 'ativar' : 'desativar'} este acesso?`)) {
            return;
        }

        try {
            const response = await fetch('/api/admin/purchases', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId, action }),
            });

            if (response.ok) {
                alert('Ação executada com sucesso!');
                loadPurchases();
            } else {
                alert('Erro ao executar ação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao executar ação');
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETE':
            case 'APPROVED':
                return '#10B981';
            case 'CANCELED':
                return '#EF4444';
            case 'REFUNDED':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Carregando...</h1>
            </div>
        );
    }

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            backgroundColor: '#F9FAFB',
            minHeight: '100vh',
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                    }}>💳 Compras Hotmart</h1>
                    <p style={{ color: '#6B7280' }}>
                        Gerenciamento de compras e assinaturas
                    </p>
                </div>
                <button
                    onClick={() => router.push('/admin')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    ← Voltar
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.5rem',
            }}>
                {['all', 'COMPLETE', 'APPROVED', 'CANCELED', 'REFUNDED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: filter === status ? '#3B82F6' : 'white',
                            color: filter === status ? 'white' : '#374151',
                            border: '1px solid #D1D5DB',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        {status === 'all' ? 'Todas' : status}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        Total de Compras
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {purchases.length}
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        Acessos Ativos
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10B981' }}>
                        {purchases.filter(p => p.user.hasActiveSubscription).length}
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        Receita Total
                    </div>
                    <div style={{
                        fontSize: '2rem', fontWeight: 700, color: '#3B82F6'
                    }}>
                        R$ {purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}>
                    <thead style={{
                        backgroundColor: '#F3F4F6',
                        borderBottom: '1px solid #E5E7EB',
                    }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Cliente</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Produto</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Valor</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Data</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Acesso</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr key={purchase.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{purchase.buyerName}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{purchase.buyerEmail}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{purchase.productName}</div>
                                    {purchase.isRecurrent && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: '#DBEAFE',
                                            color: '#1E40AF',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            display: 'inline-block',
                                            marginTop: '0.25rem',
                                        }}>
                                            Recorrente
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>
                                    {purchase.currency} {purchase.amount.toFixed(2)}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        backgroundColor: getStatusColor(purchase.status) + '20',
                                        color: getStatusColor(purchase.status),
                                    }}>
                                        {purchase.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                    {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {purchase.user.hasActiveSubscription ? (
                                        <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Ativo</span>
                                    ) : (
                                        <span style={{ color: '#EF4444', fontWeight: 600 }}>✗ Inativo</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!purchase.user.hasActiveSubscription && (
                                            <button
                                                onClick={() => handleAction(purchase.id, 'activate')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#10B981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.25rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Ativar
                                            </button>
                                        )}
                                        {purchase.user.hasActiveSubscription && (
                                            <button
                                                onClick={() => handleAction(purchase.id, 'deactivate')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.25rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Desativar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {purchases.length === 0 && (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        color: '#6B7280',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                            Nenhuma compra encontrada
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            Aguardando notificações da Hotmart
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
