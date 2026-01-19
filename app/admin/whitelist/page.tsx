
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WhitelistItem {
    id: string;
    email: string;
    note: string | null;
    createdAt: string;
}

export default function WhitelistPage() {
    const { loading, isAdmin } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<WhitelistItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/home');
        }
    }, [loading, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/whitelist');
            if (response.ok) {
                const data = await response.json();
                setItems(data.whitelist);
            }
        } catch (error) {
            console.error('Erro ao buscar whitelist:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/admin/whitelist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, note })
            });

            if (response.ok) {
                setEmail('');
                setNote('');
                fetchData();
                alert('Email adicionado!');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao adicionar');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remover este email da lista permitida?')) return;

        try {
            const response = await fetch(`/api/admin/whitelist/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setItems(items.filter(i => i.id !== id));
            } else {
                alert('Erro ao remover');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || loadingData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' }}>
                <h2>Carregando...</h2>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <Link href="/admin" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}>
                        ← Voltar ao Dashboard
                    </Link>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2c3e50', margin: '0.5rem 0 0 0' }}>
                        ✅ Whitelist de Acesso
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>

                {/* Form */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Adicionar Novo Acesso</h3>
                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Nota (Opcional)</label>
                            <input
                                type="text"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Ex: Amigo do dono, Teste VIP"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: submitting ? 'wait' : 'pointer'
                            }}
                        >
                            {submitting ? 'Adicionando...' : '+ Adicionar'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2c3e50' }}>
                            Emails Liberados ({items.length})
                        </h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#2c3e50' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#2c3e50' }}>Nota</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#2c3e50' }}>Adicionado em</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', color: '#2c3e50' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                                            Nenhum email na whitelist.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{item.email}</td>
                                            <td style={{ padding: '1rem', color: '#7f8c8d' }}>{item.note || '-'}</td>
                                            <td style={{ padding: '1rem', color: '#7f8c8d', fontSize: '0.875rem' }}>
                                                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#e74c3c',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Remover
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
