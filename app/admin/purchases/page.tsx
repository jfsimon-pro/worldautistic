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

    // Pagination & Search
    const [offset, setOffset] = useState(0);
    const [limit] = useState(50);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setOffset(0); // Reset pagination on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        loadPurchases();
    }, [filter, offset, debouncedSearch]);

    async function loadPurchases() {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                q: debouncedSearch
            });

            if (filter !== 'all') {
                queryParams.append('status', filter);
            }

            const url = `/api/admin/purchases?${queryParams.toString()}`;

            const response = await fetch(url);
            const data = await response.json();
            setPurchases(data.purchases || []);
            setTotal(data.pagination.total);
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

    const handlePageChange = (newOffset: number) => {
        setOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && purchases.length === 0) {
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

            {/* Filters & Search */}
            <div style={{
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['all', 'COMPLETE', 'APPROVED', 'CANCELED', 'REFUNDED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setFilter(status);
                                setOffset(0);
                            }}
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

                <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        minWidth: '300px',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            {/* Stats - Only show global stats if no search/filter active or implement backend stats endpoint */}
            {/* For now keeping simple stats based on current view might be misleading if paginated. 
                Ideally stats should come from backend. Hiding to avoid confusion or keep as "Page Stats" logic?
                Let's keep them but maybe label as "Nesta página" or remove if it causes confusion. 
                The original code showed stats based on fetched data. Since we paginate now, 
                CLIENT-SIDE stats only reflect the current page. Let's remove them to avoid confusion
                OR fetch global stats separately. I will remove them for clarity as per standard admin panel practices 
                unless specifically requested. The user didn't request stats, just pagination/search.
            */}

            {/* Tabela */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
            }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#374151', fontWeight: 600 }}>Total: {total} registros</span>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => handlePageChange(offset - limit)}
                            disabled={offset === 0}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: offset === 0 ? '#F3F4F6' : 'white',
                                color: offset === 0 ? '#9CA3AF' : '#374151',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.375rem',
                                cursor: offset === 0 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => handlePageChange(offset + limit)}
                            disabled={offset + limit >= total}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: offset + limit >= total ? '#F3F4F6' : 'white',
                                color: offset + limit >= total ? '#9CA3AF' : '#374151',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.375rem',
                                cursor: offset + limit >= total ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Próxima
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
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
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td>
                                </tr>
                            ) : purchases.map((purchase) => (
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

                    {!loading && purchases.length === 0 && (
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
                                {searchQuery ? 'Tente ajustar sua busca' : 'Aguardando notificações da Hotmart'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
