import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiration } from '@/app/lib/auth';
import { setAuthCookies } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        console.log('\n🟢 [LOGIN API] ==================');
        const body = await request.json();
        const { email } = body;
        console.log('📧 [LOGIN API] Email:', email);

        // Validações básicas
        if (!email) {
            console.log('❌ [LOGIN API] Validação falhou: email vazio');
            return NextResponse.json(
                { error: 'Email é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar usuário e validação rigorosa de assinatura
        console.log('🔍 [LOGIN API] Buscando usuário...');
        const user = await prisma.user.findUnique({
            where: { email },
        }) as any; // Casting to any to avoid TS errors with potentially outdated client generation

        // 1. Verifica se usuário existe
        if (!user) {
            console.log('❌ [LOGIN API] Usuário não encontrado');
            return NextResponse.json(
                { error: 'Email não encontrado' },
                { status: 404 }
            );
        }

        console.log('✅ [LOGIN API] Usuário encontrado:', user.id);
        console.log('📊 [LOGIN API] Status Assinatura:', user.subscriptionStatus);
        console.log('⏳ [LOGIN API] Tem Assinatura Ativa:', user.hasActiveSubscription);
        console.log('📅 [LOGIN API] Expira em:', user.subscriptionExpiresAt);

        // 2. Validação RIGOROSA de status da assinatura (Exceto Admin)
        if (user.role !== 'ADMIN') {
            // Verificar whitelist primeiro
            const whitelisted = await (prisma as any).whitelist.findUnique({
                where: { email: user.email.toLowerCase().trim() }
            });

            if (whitelisted) {
                console.log('✅ [LOGIN API] Acesso liberado por Whitelist:', user.email);
            } else {
                const isStatusActive = user.subscriptionStatus === 'active';
                const isNotExpired = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) > new Date() : false;

                // A flag hasActiveSubscription é apenas um cache, a verdade está no status e data
                const isValidAccess = isStatusActive && isNotExpired;

                if (!isValidAccess) {
                    console.log('❌ [LOGIN API] Acesso negado: assinatura inválida, expirada ou cancelada');
                    console.log(`Diagnostic: Status=${user.subscriptionStatus}, Expired=${!isNotExpired}`);
                    return NextResponse.json(
                        {
                            error: 'Assinatura necessária ou expirada',
                            details: 'subscription_required'
                        },
                        { status: 403 }
                    );
                }
            }
        }

        console.log('✅ [LOGIN API] Acesso autorizado (Validação Rigorosa Ok)');

        // Gerar tokens JWT
        console.log('🎫 [LOGIN API] Gerando tokens...');
        const accessToken = await generateAccessToken(user.id, user.role);
        const refreshToken = await generateRefreshToken(user.id);

        // Limite de Sessões Simultâneas
        const MAX_SESSIONS = 2;

        // Buscar tokens ativos do usuário
        const activeTokens = await prisma.refreshToken.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'asc' }, // Mais antigos primeiro
            select: { id: true, token: true }
        });

        if (activeTokens.length >= MAX_SESSIONS) {
            console.log(`⚠️ [LOGIN API] Limite de sessões atingido (${activeTokens.length}/${MAX_SESSIONS}). Removendo antigas...`);

            // Quantos precisam ser removidos? (tamanho atual + 1 novo - limite)
            // Na prática, removemos os excedentes para deixar espaço para o novo ser o 3º (ou Maxth)
            const tokensToRemoveCount = activeTokens.length - MAX_SESSIONS + 1;
            const tokensToRemove = activeTokens.slice(0, tokensToRemoveCount);

            const idsToRemove = tokensToRemove.map(t => t.id);

            if (idsToRemove.length > 0) {
                await prisma.refreshToken.deleteMany({
                    where: { id: { in: idsToRemove } }
                });
                console.log(`🚫 [LOGIN API] ${idsToRemove.length} tokens antigos removidos.`);
            }
        }

        // Salvar refresh token no banco
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiration(),
            },
        });
        console.log('✅ [LOGIN API] Tokens gerados e salvos');

        // Atualizar streak do usuário
        const { updateUserStreak } = await import('@/app/lib/streak');
        await updateUserStreak(user.id);

        // Tentar atualizar último login
        prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        }).catch((err: any) => console.error('⚠️ Erro ao atualizar lastLoginAt:', err));

        // Criar response com cookies
        const response = NextResponse.json({
            message: 'Login realizado com sucesso',
        });

        const finalResponse = setAuthCookies(response, accessToken, refreshToken);
        console.log('✅ [LOGIN API] Login concluído com sucesso (modo email-only)\n');

        return finalResponse;
    } catch (error) {
        console.error('💥 [LOGIN API] Erro:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer login. Tente novamente.' },
            { status: 500 }
        );
    }
}
