'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Card {
    id: string;
    slug: string;
    namePt: string;
    imageUrl: string;
    audioPt?: string | null; // Novo campo
    color?: string;
    bgColor: string | null;
    isActive: boolean;
}

export default function ColorsManagement() {
    const [colors, setColors] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        namePt: '',
        slug: '',
        imageUrl: '',
        audioPt: '', // Novo estado
        bgColor: '#ffffff',
    });

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const res = await fetch('/api/admin/cards?category=COLORS');
            const data = await res.json();
            if (Array.isArray(data)) setColors(data);
        } catch (error) {
            console.error('Erro ao buscar cores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingCard
                ? `/api/admin/cards/${editingCard.id}`
                : '/api/admin/cards';

            const method = editingCard ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Necessário para enviar cookies
                body: JSON.stringify({
                    ...formData,
                    category: 'COLORS',
                    slug: formData.slug || formData.namePt.toLowerCase().replace(/\s+/g, '-'),
                }),
            });

            if (res.ok) {
                fetchColors();
                closeModal();
            } else {
                alert('Erro ao salvar');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            const res = await fetch(`/api/admin/cards/${id}`, { method: 'DELETE' });
            if (res.ok) fetchColors();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (card: Card) => {
        setEditingCard(card);
        setFormData({
            namePt: card.namePt,
            slug: card.slug,
            imageUrl: card.imageUrl,
            audioPt: card.audioPt || '', // Carregar áudio existente
            bgColor: card.bgColor || card.color || '#ffffff', // Fallback melhorado
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCard(null);
        setFormData({ namePt: '', slug: '', imageUrl: '', audioPt: '', bgColor: '#ffffff' });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link href="/admin" style={{ color: '#667eea', textDecoration: 'none', marginBottom: '10px', display: 'inline-block' }}>
                        ← Voltar ao Dashboard
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.75rem', color: '#2c3e50', margin: 0 }}>🎨 Gerenciar Cores</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            + Nova Cor
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {colors.map((card) => (
                            <div key={card.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <div style={{ height: '150px', backgroundColor: card.color || card.bgColor || '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {card.imageUrl ? (
                                        <img src={card.imageUrl} alt={card.namePt} style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '3rem' }}>🎨</span>
                                    )}
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{card.namePt}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => openEdit(card)}
                                            style={{ flex: 1, padding: '0.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            style={{ flex: 1, padding: '0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginTop: 0 }}>{editingCard ? 'Editar Cor' : 'Nova Cor'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome (PT)</label>
                                <input
                                    type="text"
                                    value={formData.namePt}
                                    onChange={(e) => setFormData({ ...formData, namePt: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Slug (URL Amigável)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="Ex: vermelho-vivo"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Imagem</label>

                                {/* Visualização da imagem atual */}
                                {formData.imageUrl && (
                                    <div style={{ marginBottom: '1rem', width: '100px', height: '100px', backgroundColor: formData.bgColor || '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setIsUploading(true);
                                            const uploadData = new FormData();
                                            uploadData.append('file', file);
                                            uploadData.append('folder', 'colors');

                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: uploadData,
                                                    credentials: 'include',
                                                });

                                                if (res.ok) {
                                                    const data = await res.json();
                                                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                                                } else {
                                                    alert('Erro ao fazer upload da imagem');
                                                }
                                            } catch (error) {
                                                console.error('Erro no upload:', error);
                                                alert('Erro ao fazer upload');
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                {isUploading && <p style={{ fontSize: '0.8rem', color: '#666' }}>Fazendo upload...</p>}

                                <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '0.8rem', color: '#888' }}>
                                    Ou use uma URL externa:
                                </p>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', marginTop: '0.25rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cor de Fundo (Hex)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="color"
                                        value={formData.bgColor}
                                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                                        style={{ height: '38px' }}
                                    />
                                    <input
                                        type="text"
                                        value={formData.bgColor}
                                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Áudio (Opcional)</label>
                                {/* Áudio Player Preview */}
                                {formData.audioPt && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <audio controls src={formData.audioPt} style={{ width: '100%' }} />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setIsUploading(true);
                                        const uploadData = new FormData();
                                        uploadData.append('file', file);
                                        uploadData.append('folder', 'audio/colors'); // Pasta específica

                                        try {
                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: uploadData,
                                                credentials: 'include',
                                            });

                                            if (res.ok) {
                                                const data = await res.json();
                                                setFormData(prev => ({ ...prev, audioPt: data.url }));
                                            } else {
                                                alert('Erro ao fazer upload do áudio');
                                            }
                                        } catch (error) {
                                            console.error('Erro no upload:', error);
                                            alert('Erro no upload');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        backgroundColor: isUploading ? '#bdc3c7' : '#2ecc71',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: isUploading ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isUploading ? 'Enviando imagem...' : 'Salvar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ flex: 1, padding: '0.75rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
