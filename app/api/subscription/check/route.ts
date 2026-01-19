import { NextRequest, NextResponse } from 'next/server';
import { hasActiveAccess } from '@/app/lib/subscription';

/**
 * GET /api/subscription/check
 * 
 * Verifica se usuário tem acesso ativo
 * Usado pelo SubscriptionGuard
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const hasAccess = await hasActiveAccess(userId);

        // Buscar informações adicionais se tiver acesso
        let expiresAt = null;
        if (hasAccess) {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { subscriptionExpiresAt: true },
            });

            expiresAt = user?.subscriptionExpiresAt;
        }

        return NextResponse.json({
            hasAccess,
            expiresAt,
        });
    } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
