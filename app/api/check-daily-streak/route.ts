import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';
import { updateUserStreak } from '@/app/lib/streak';

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticação
        const token = getAccessTokenFromRequest(request);

        if (!token) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const payload = await verifyAccessToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            );
        }

        // Atualizar streak do usuário autenticado
        await updateUserStreak(payload.userId);

        return NextResponse.json({
            message: 'Streak verificado e atualizado',
        });
    } catch (error) {
        console.error('Erro ao verificar streak diário:', error);
        // Não bloqueia o app se falhar
        return NextResponse.json(
            { message: 'Erro ao verificar streak, mas app continua funcionando' },
            { status: 200 }
        );
    }
}
