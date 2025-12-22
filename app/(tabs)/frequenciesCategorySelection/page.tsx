'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/LevelSelection.module.css';
import { getCategoryTranslation } from '../../utils/audioTranslations';

// Função para formatar nomes vindos da Cloudinary
function formatCategoryName(name: string): string {
    // Primeiro tenta obter tradução em português
    const translation = getCategoryTranslation(name);

    // Se encontrou tradução, retorna
    if (translation && translation !== name) {
        return translation;
    }

    // Caso contrário, formata o nome original
    return name
        .replace(/_/g, ' ')  // Remove underscores
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Adiciona espaço antes de maiúsculas (camelCase)
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // Separa siglas seguidas de palavra
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitaliza cada palavra
        .join(' ');
}

export default function FrequenciesCategorySelectionPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await fetch('/api/frequency-categories');
                const data = await response.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <PageLayout backHref="/home">
            <div className={styles.container}>
                <h1 className={styles.title}>Selecione a Categoria</h1>

                {loading ? (
                    <p>Carregando categorias...</p>
                ) : categories.length === 0 ? (
                    <p>Nenhuma categoria disponível</p>
                ) : (
                    <div className={styles.buttons}>
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={`/frequencies?category=${encodeURIComponent(category)}`}
                                className={styles.button}
                            >
                                {formatCategoryName(category)}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
