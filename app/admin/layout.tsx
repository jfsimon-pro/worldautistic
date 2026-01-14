'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Usuários', href: '/admin/users', icon: '👥' },
        { name: 'Cores', href: '/admin/content/colors', icon: '🎨' },
        { name: 'Animais', href: '/admin/content/animals', icon: '🦁' },
        { name: 'Alimentos', href: '/admin/content/food', icon: '🍎' },
        { name: 'Objetos', href: '/admin/content/objects', icon: '⚽' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    backgroundColor: '#1a1f2c',
                    color: '#ecf0f1',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
                    transition: 'width 0.3s ease',
                    flexShrink: 0
                }}
            >
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Luminon<span style={{ color: '#3498db' }}>.Admin</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                    <p style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: '#6c7a89',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        paddingLeft: '0.5rem'
                    }}>
                        Menu Principal
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: isActive ? '#fff' : '#aab7c4',
                                            backgroundColor: isActive ? '#3498db' : 'transparent',
                                            fontWeight: isActive ? '600' : '400',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#34495e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold'
                        }}>
                            A
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>Admin</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#7f8c8d' }}>Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowX: 'hidden' }}>
                {children}
            </main>
        </div>
    );
}
