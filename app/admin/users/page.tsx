'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    language: string;
    createdAt: string;
    lastLoginAt: string | null;
    userStreaks: Array<{
        currentStreak: number;
        longestStreak: number;
    }>;
}

export default function UsersManagement() {
    const { loading, isAdmin } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', role: '' });

    // Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/home');
        }
    }, [loading, isAdmin, router]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin, currentPage, debouncedSearch]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: '50',
                q: debouncedSearch
            });

            const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user.id);
        setEditForm({ name: user.name, role: user.role });
    };

    const handleSave = async (userId: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                await fetchUsers();
                setEditingUser(null);
                alert('Usuário atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar usuário');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e apagará todo o histórico.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                // Remove from local state immediately for better UX
                setUsers(users.filter(u => u.id !== userId));

                // If the list becomes empty, try to fetch previous page
                if (users.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchUsers(); // Refresh to get correct data
                }

                alert('Usuário excluído com sucesso!');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao excluir usuário');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' }}>
                <h2>Carregando...</h2>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Link href="/admin" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}>
                            ← Voltar ao Dashboard
                        </Link>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2c3e50', margin: '0.5rem 0 0 0' }}>
                            👥 Gestão de Usuários
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                width: '300px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                    {loadingUsers ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <p>Carregando usuários...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2c3e50' }}>
                                    Lista de Usuários ({users.length} na página)
                                </h2>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px', background: currentPage === 1 ? '#f5f5f5' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                        >
                                            Anterior
                                        </button>
                                        <span style={{ fontSize: '0.9rem', color: '#2c3e50' }}>
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px', background: currentPage === totalPages ? '#f5f5f5' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                )}
                            </div>

                            {users.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                    Nenhum usuário encontrado.
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Nome</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Email</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Role</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Streak</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Último Login</th>
                                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#2c3e50' }}>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                    <td style={{ padding: '1rem' }}>
                                                        {editingUser === user.id ? (
                                                            <input
                                                                type="text"
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                                                            />
                                                        ) : (
                                                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{user.name}</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#7f8c8d' }}>{user.email}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {editingUser === user.id ? (
                                                            <select
                                                                value={editForm.role}
                                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                                            >
                                                                <option value="USER">USER</option>
                                                                <option value="ADMIN">ADMIN</option>
                                                            </select>
                                                        ) : (
                                                            <span style={{
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600',
                                                                backgroundColor: user.role === 'ADMIN' ? '#ffe0e0' : '#e0f7fa',
                                                                color: user.role === 'ADMIN' ? '#e74c3c' : '#00bcd4',
                                                            }}>
                                                                {user.role}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {user.userStreaks[0] ? (
                                                            <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                                                                🔥 {user.userStreaks[0].currentStreak} dias
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#95a5a6' }}>-</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#7f8c8d', fontSize: '0.875rem' }}>
                                                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        {editingUser === user.id ? (
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => handleSave(user.id)}
                                                                    style={{ padding: '0.5rem 1rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                                                >
                                                                    ✓ Salvar
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingUser(null)}
                                                                    style={{ padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => handleEdit(user)}
                                                                    style={{ padding: '0.5rem 1rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                                                >
                                                                    ✏️ Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                                                >
                                                                    🗑️ Excluir
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Bottom Pagination Info */}
                            {users.length > 0 && (
                                <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0', textAlign: 'center', color: '#7f8c8d', fontSize: '0.875rem' }}>
                                    Mostrando {users.length} usuários
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
