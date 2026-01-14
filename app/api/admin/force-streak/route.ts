import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
        }

        // Forçar atualização de streak
        const { updateUserStreak } = await import('@/app/lib/streak');
        await updateUserStreak(userId);

        // Buscar streak atualizado
        const streak = await prisma.userStreak.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        return NextResponse.json({
            message: 'Streak atualizado',
            streak,
        });
    } catch (error) {
        console.error('Erro ao forçar atualização:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar streak' },
            { status: 500 }
        );
    }
}
