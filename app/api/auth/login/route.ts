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

        // Buscar usuário
        console.log('🔍 [LOGIN API] Buscando usuário...');
        const user = await prisma.user.findUnique({
            where: { email },
        });

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

        // 2. Verifica se tem assinatura ativa (Substitui senha)
        // Admin sempre pode logar, usuários precisam de assinatura
        if (user.role !== 'ADMIN' && !user.hasActiveSubscription) {
            console.log('❌ [LOGIN API] Acesso negado: sem assinatura ativa');
            return NextResponse.json(
                {
                    error: 'Assinatura necessária',
                    details: 'subscription_required'
                },
                { status: 403 }
            );
        }

        console.log('✅ [LOGIN API] Acesso autorizado (Assinatura Ativa)');

        // Gerar tokens JWT
        console.log('🎫 [LOGIN API] Gerando tokens...');
        const accessToken = await generateAccessToken(user.id, user.role);
        const refreshToken = await generateRefreshToken(user.id);

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
