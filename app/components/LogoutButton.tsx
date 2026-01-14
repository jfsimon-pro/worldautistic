'use client';

import { useAuth } from '../hooks/useAuth';

export default function LogoutButton() {
    const { logout, user } = useAuth();

    if (!user) return null;

    return (
        <button
            onClick={logout}
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                zIndex: 1000,
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = '#667eea';
            }}
        >
            <span>👋</span>
            <span>Sair</span>
        </button>
    );
}
