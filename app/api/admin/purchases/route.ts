import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/purchases
 * 
 * Lista todas as compras com filtros opcionais
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);
        const search = searchParams.get('q') || '';

        const where: any = {};

        if (userId) {
            where.userId = userId;
        }

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { buyerName: { contains: search, mode: 'insensitive' } },
                { buyerEmail: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [purchases, total] = await Promise.all([
            prisma.purchase.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            subscriptionStatus: true,
                            hasActiveSubscription: true,
                        },
                    },
                },
                orderBy: {
                    purchaseDate: 'desc',
                },
                take: limit,
                skip: offset,
            }),
            prisma.purchase.count({ where }),
        ]);

        return NextResponse.json({
            purchases,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        });
    } catch (error) {
        console.error('Erro ao buscar compras:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/purchases
 * 
 * Atualiza status de uma compra manualmente (ação administrativa)
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { purchaseId, action } = body;

        if (!purchaseId || !action) {
            return NextResponse.json(
                { error: 'purchaseId and action are required' },
                { status: 400 }
            );
        }

        const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId },
            include: { user: true },
        });

        if (!purchase) {
            return NextResponse.json(
                { error: 'Purchase not found' },
                { status: 404 }
            );
        }

        // Executar ação baseada no tipo
        const { activateAccess, deactivateAccess } = await import('@/app/lib/subscription');
        const { calculateExpirationDate } = await import('@/app/lib/hotmart');

        switch (action) {
            case 'activate':
                const expiresAt = calculateExpirationDate(purchase.isRecurrent);
                await activateAccess(purchase.userId, expiresAt);
                await prisma.purchase.update({
                    where: { id: purchaseId },
                    data: { status: 'COMPLETE' },
                });
                break;

            case 'deactivate':
                await deactivateAccess(purchase.userId, 'canceled');
                await prisma.purchase.update({
                    where: { id: purchaseId },
                    data: { status: 'CANCELED' },
                });
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            message: `Action ${action} executed successfully`,
        });
    } catch (error) {
        console.error('Erro ao atualizar compra:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
