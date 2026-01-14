import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, getRefreshTokenExpiration } from '@/app/lib/auth';
import { getRefreshTokenFromRequest, setAuthCookies } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        // Pegar refresh token do cookie
        const oldRefreshToken = getRefreshTokenFromRequest(request);

        if (!oldRefreshToken) {
            return NextResponse.json(
                { error: 'Refresh token não fornecido' },
                { status: 401 }
            );
        }

        // Verificar refresh token
        const payload = verifyRefreshToken(oldRefreshToken);

        if (!payload) {
            return NextResponse.json(
                { error: 'Refresh token inválido' },
                { status: 401 }
            );
        }

        // Verificar se o refresh token existe no banco e não expirou
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { token: oldRefreshToken },
            include: { user: true },
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Refresh token expirado ou inválido' },
                { status: 401 }
            );
        }

        // Gerar novos tokens
        const newAccessToken = generateAccessToken(tokenRecord.user.id, tokenRecord.user.role);
        const newRefreshToken = generateRefreshToken(tokenRecord.user.id);

        // Substituir refresh token no banco (rotação de tokens)
        await prisma.$transaction([
            // Deletar token antigo
            prisma.refreshToken.delete({
                where: { token: oldRefreshToken },
            }),
            // Criar novo token
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: tokenRecord.user.id,
                    expiresAt: getRefreshTokenExpiration(),
                },
            }),
        ]);

        // Criar response com novos cookies
        const response = NextResponse.json({
            message: 'Tokens renovados com sucesso',
        });

        return setAuthCookies(response, newAccessToken, newRefreshToken);
    } catch (error) {
        console.error('Erro ao renovar tokens:', error);
        return NextResponse.json(
            { error: 'Erro ao renovar tokens' },
            { status: 500 }
        );
    }
}
