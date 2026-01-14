import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { CardCategory } from '@prisma/client';

// Rota pública para buscar conteúdo (cards)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category || !Object.values(CardCategory).includes(category as CardCategory)) {
        return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
    }

    try {
        const cards = await prisma.card.findMany({
            where: {
                category: category as CardCategory,
                isActive: true, // Apenas ativos
            },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                identifier: true, // Schema expects identifier, not slug
                namePt: true,
                nameEn: true,
                nameEs: true,
                imageUrl: true,
                color: true, // Schema uses color, not bgColor
                borderColor: true,
                textColor: true,
                audioPt: true, // Schema uses audioPt, not audioUrlPt
                // Adicione outros campos necessários
            }
        });

        return NextResponse.json(cards);
    } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
