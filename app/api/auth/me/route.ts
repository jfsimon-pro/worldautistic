import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Pegar token do cookie
        const token = getAccessTokenFromRequest(request);

        if (!token) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        // Verificar token
        const payload = await verifyAccessToken(token);

        console.log('🔍 [ME API] Payload completo:', payload);

        if (!payload || !payload.userId) {
            console.log('❌ [ME API] Payload inválido ou sem userId');
            return NextResponse.json(
                { error: 'Token inválido ou expirado' },
                { status: 401 }
            );
        }

        console.log('✅ [ME API] UserId:', payload.userId);

        // Buscar dados do usuário
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                dateOfBirth: true,
                language: true,
                soundEnabled: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados do usuário' },
            { status: 500 }
        );
    }
}
