import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';
// import { CardCategory } from '@prisma/client'; // Evitar erro de import em runtime se não gerado

// Helper para verificar admin
async function checkAdmin(request: NextRequest) {
    const token = getAccessTokenFromRequest(request);
    if (!token) return false;
    const payload = await verifyAccessToken(token);
    return payload?.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const validCategories = ['ANIMALS', 'FOOD', 'OBJECTS', 'COLORS', 'COMMANDS'];

    if (!category || !validCategories.includes(category)) {
        return NextResponse.json({ error: 'Categoria inválida ou não fornecida' }, { status: 400 });
    }

    try {
        const cards = await prisma.card.findMany({
            where: { category: category as any }, // Cast para any para evitar erro de tipo estrito
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(cards);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar cards' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        console.log('📦 Body recebido no POST /api/admin/cards:', body);

        // Validação básica
        const missingFields = [];
        if (!body.namePt) missingFields.push('namePt');
        if (!body.imageUrl) missingFields.push('imageUrl');
        if (!body.slug) missingFields.push('slug');

        if (missingFields.length > 0) {
            console.log('⚠️ Campos faltando:', missingFields);
            return NextResponse.json({ error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` }, { status: 400 });
        }

        const maxOrder = await prisma.card.aggregate({
            where: { category: body.category as any },
            _max: { order: true }
        });
        const nextOrder = (maxOrder._max.order || 0) + 1;

        const card = await prisma.card.create({
            data: {
                category: body.category as any,
                namePt: body.namePt,
                nameEn: body.nameEn || body.namePt,
                nameEs: body.nameEs || body.namePt,
                // slug: body.slug, // Removido pois não existe no schema (usar identifier)
                identifier: body.slug, // Identificador único
                imageUrl: body.imageUrl,
                audioPt: body.audioPt, // Salvando áudio
                color: body.bgColor || '#ffffff',
                borderColor: body.bgColor || '#cccccc',
                order: nextOrder,
                isActive: true
            }
        });

        return NextResponse.json(card);
    } catch (error) {
        console.error('Erro ao criar card:', error);
        return NextResponse.json({ error: 'Erro ao criar card' }, { status: 500 });
    }
}
