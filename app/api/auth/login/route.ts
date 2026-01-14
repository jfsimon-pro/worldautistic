import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiration } from '@/app/lib/auth';
import { setAuthCookies } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        console.log('\n🟢 [LOGIN API] ==================');
        const body = await request.json();
        const { email, password } = body;
        console.log('📧 [LOGIN API] Email:', email);

        // Validações básicas
        if (!email || !password) {
            console.log('❌ [LOGIN API] Validação falhou');
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuário
        console.log('🔍 [LOGIN API] Buscando usuário...');
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ [LOGIN API] Usuário não encontrado');
            return NextResponse.json(
                { error: 'Email ou senha incorretos' },
                { status: 401 }
            );
        }

        console.log('✅ [LOGIN API] Usuário encontrado:', user.id);

        // Verificar senha
        console.log('🔑 [LOGIN API] Verificando senha...');
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            console.log('❌ [LOGIN API] Senha incorreta');
            return NextResponse.json(
                { error: 'Email ou senha incorretos' },
                { status: 401 }
            );
        }

        console.log('✅ [LOGIN API] Senha correta');

        // Gerar tokens JWT
        console.log('🎫 [LOGIN API] Gerando tokens...');
        const accessToken = await generateAccessToken(user.id, user.role);
        const refreshToken = await generateRefreshToken(user.id);
        console.log('✅ [LOGIN API] Access Token:', accessToken.substring(0, 20) + '...');
        console.log('✅ [LOGIN API] Refresh Token:', refreshToken.substring(0, 20) + '...');

        // Salvar refresh token no banco
        console.log('💾 [LOGIN API] Salvando refresh token...');
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiration(),
            },
        });
        console.log('✅ [LOGIN API] Refresh token salvo');

        // Atualizar streak do usuário
        console.log('🔥 [LOGIN API] Atualizando streak...');
        const { updateUserStreak } = await import('@/app/lib/streak');
        await updateUserStreak(user.id);

        // Tentar atualizar último login (não-bloqueante)
        prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        }).catch((err: any) => {
            console.error('⚠️ [LOGIN API] Erro ao atualizar lastLoginAt:', err);
        });

        // Criar response com cookies
        console.log('🍪 [LOGIN API] Definindo cookies...');
        const response = NextResponse.json({
            message: 'Login realizado com sucesso',
        });

        const finalResponse = setAuthCookies(response, accessToken, refreshToken);
        console.log('✅ [LOGIN API] Cookies definidos na response');
        console.log('🍪 [LOGIN API] Response headers:', finalResponse.headers.get('set-cookie'));
        console.log('✅ [LOGIN API] Login concluído com sucesso!\n');

        return finalResponse;
    } catch (error) {
        console.error('💥 [LOGIN API] Erro:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer login. Tente novamente.' },
            { status: 500 }
        );
    }
}
