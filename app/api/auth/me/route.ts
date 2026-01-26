import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
    const noCacheHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    };

    try {
        // Pegar token do cookie
        const token = getAccessTokenFromRequest(request);
        let userId: string | null = null;
        let shouldRefresh = false;

        // 1. Tentar validar Access Token
        if (token) {
            const payload = await verifyAccessToken(token);
            if (payload?.userId) {
                userId = payload.userId;
            } else {
                shouldRefresh = true;
            }
        } else {
            shouldRefresh = true;
        }

        // 2. Se Access Token inválido, tentar Refresh Token
        if (shouldRefresh) {
            console.log('🔄 [ME API] Access Token expirado ou ausente. Tentando Refresh...');
            const { getRefreshTokenFromRequest, setAuthCookies } = await import('@/app/lib/cookies');
            const { verifyRefreshToken, generateAccessToken, generateRefreshToken, getRefreshTokenExpiration } = await import('@/app/lib/auth');

            const refreshToken = getRefreshTokenFromRequest(request);

            if (!refreshToken) {
                return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
            }

            // Verificar Refresh Token
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if (!refreshPayload?.userId) {
                console.log('❌ [ME API] Refresh Token inválido.');
                return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
            }

            // Verificar no banco
            const tokenRecord = await prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true }
            });

            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                console.log('❌ [ME API] Refresh Token não encontrado ou expirado no banco.');
                return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 });
            }

            // ROTAÇÃO DE TOKENS - ALTERADO PARA ROLLING SESSION
            // Motivo: Rotação estrita (Delete/Create) causa condições de corrida (Race Conditions)
            // quando múltiplas requisições tentam renovar ao mesmo tempo (ex: abas abertas, requests paralelos).
            // Solução: Manter o mesmo Refresh Token, apenas estender a validade.

            userId = tokenRecord.userId;
            console.log('✅ [ME API] Refresh Token válido para User:', userId);

            const newAccessToken = await generateAccessToken(userId!, tokenRecord.user.role);
            // Mantemos o mesmo refresh token, apenas atualizamos a validade no banco
            const currentRefreshToken = refreshToken;

            try {
                await prisma.refreshToken.update({
                    where: { id: tokenRecord.id },
                    data: {
                        expiresAt: getRefreshTokenExpiration(),
                    }
                });
            } catch (err) {
                // Se falhar update (ex: deletado concorrentemente), loga mas tenta seguir se possível, ou falha.
                console.error('⚠️ [ME API] Erro ao atualizar validade do token:', err);
                // Se o token não existe mais, retornamos 401
                if ((err as any).code === 'P2025') {
                    return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 });
                }
            }

            // Buscar user para retornar
            const user = await prisma.user.findUnique({
                where: { id: userId! },
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

            if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

            // Retornar resposta com NOVOS cookies
            const response = NextResponse.json({ user });
            return setAuthCookies(response, newAccessToken, currentRefreshToken);
        }

        // 3. Se Access Token estava válido, prosseguir normal
        console.log('✅ [ME API] Access Token válido. UserId:', userId);

        // Buscar dados do usuário (Mesma query de cima, duplicada para simplificar fluxo)
        const user = await prisma.user.findUnique({
            where: { id: userId! },
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

        return NextResponse.json({ user }, { headers: noCacheHeaders });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados do usuário' },
            { status: 500 }
        );
    }
}
