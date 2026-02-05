import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

export async function GET(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Buscar todos os UserStreaks
        const streaks = await prisma.userStreak.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        // Buscar usuários sem streak
        const usersWithoutStreak = await prisma.user.findMany({
            where: {
                userStreak: {
                    is: null,
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        return NextResponse.json({
            streaks,
            usersWithoutStreak,
            total: streaks.length,
            withoutStreak: usersWithoutStreak.length,
        });
    } catch (error) {
        console.error('Erro ao buscar streaks:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar streaks' },
            { status: 500 }
        );
    }
}
