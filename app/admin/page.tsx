'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
    users: {
        total: number;
        active: number;
        recent: number;
    };
    content: {
        activities: number;
        games: number;
        cards: number;
        achievements: number;
    };
    engagement: {
        activitiesCompleted: number;
        topStreaks: Array<{
            userName: string;
            currentStreak: number;
            longestStreak: number;
        }>;
    };
}

export default function AdminDashboard() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/home');
        }
    }, [loading, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            fetchStats();
        }
    }, [isAdmin]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    if (loading || loadingStats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Carregando...</h2>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header Simplified */}
            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2c3e50', margin: 0 }}>Dashboard Admin</h1>
                    <p style={{ color: '#7f8c8d', marginTop: '0.25rem' }}>Bem-vindo, <strong>{user?.name}</strong></p>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <StatCard title="Total de Usuários" value={stats?.users.total || 0} icon="👥" color="#3498db" />
                    <StatCard title="Usuários Ativos (7d)" value={stats?.users.active || 0} icon="✅" color="#2ecc71" />
                    <StatCard title="Novos Usuários (7d)" value={stats?.users.recent || 0} icon="🆕" color="#9b59b6" />
                    <StatCard title="Atividades Completadas" value={stats?.engagement.activitiesCompleted || 0} icon="📚" color="#e74c3c" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <StatCard title="Cards Ativos" value={stats?.content.cards || 0} icon="🃏" color="#f39c12" />
                    <StatCard title="Atividades" value={stats?.content.activities || 0} icon="✏️" color="#1abc9c" />
                    <StatCard title="Jogos" value={stats?.content.games || 0} icon="🎮" color="#e67e22" />
                    <StatCard title="Conquistas" value={stats?.content.achievements || 0} icon="🏆" color="#f1c40f" />
                </div>

                {/* Top Streaks */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#2c3e50' }}>
                        🔥 Top 5 Usuários (Streak)
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats?.engagement.topStreaks.map((streak, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                                    {index + 1}. {streak.userName}
                                </span>
                                <span style={{ color: '#e74c3c', fontWeight: '700' }}>
                                    {streak.currentStreak} dias 🔥
                                </span>
                            </div>
                        )) || <p style={{ color: '#7f8c8d' }}>Nenhum streak disponível</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    return (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2c3e50', margin: 0 }}>{value}</p>
                </div>
                <div style={{ fontSize: '2.5rem' }}>{icon}</div>
            </div>
        </div>
    );
}
