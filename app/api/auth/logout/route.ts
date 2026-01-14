import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { clearAuthCookies } from '@/app/lib/cookies';
import { getRefreshTokenFromRequest } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        const refreshToken = getRefreshTokenFromRequest(request);

        if (refreshToken) {
            // Remover refresh token do banco
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            }).catch(() => {
                // Ignora erro se token não existe
            });
        }

        // Criar response e limpar cookies
        const response = NextResponse.json({
            message: 'Logout realizado com sucesso',
        });

        return clearAuthCookies(response);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer logout' },
            { status: 500 }
        );
    }
}
