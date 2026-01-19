
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

// GET: Listar whitelist
export async function GET(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const whitelist = await (prisma as any).whitelist.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ whitelist });

    } catch (error) {
        console.error('Erro ao buscar whitelist:', error);
        return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
    }
}

// POST: Adicionar email à whitelist
export async function POST(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const body = await request.json();
        const { email, note } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const alreadyExists = await (prisma as any).whitelist.findUnique({
            where: { email: normalizedEmail }
        });

        if (alreadyExists) {
            return NextResponse.json({ error: 'Email já está na whitelist' }, { status: 400 });
        }

        // 1. Adicionar na Whitelist
        const newEntry = await (prisma as any).whitelist.create({
            data: {
                email: normalizedEmail,
                note
            }
        });

        // 2. Garantir que o USER existe no banco principal
        const userExists = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!userExists) {
            console.log('👤 [WHITELIST] Criando usuário novo para:', normalizedEmail);
            await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    name: normalizedEmail.split('@')[0],
                    role: 'USER',
                    subscriptionStatus: 'active',
                    hasActiveSubscription: true,
                    subscriptionExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 10))
                } as any
            });
        }

        // 3. Criar uma compra manual simulada (Para aparecer em Compras e garantir acesso se houver outra verificação)
        // Isso atende ao pedido de "simular como se fosse uma compra"
        const existingPurchase = await (prisma as any).purchase.findFirst({
            where: {
                userId: userExists ? userExists.id : (await prisma.user.findUnique({ where: { email: normalizedEmail } }))?.id
            }
        });

        if (!existingPurchase) {
            const targetUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
            if (targetUser) {
                await (prisma as any).purchase.create({
                    data: {
                        userId: targetUser.id,
                        hotmartTransactionId: `WHITELIST_${Date.now()}`,
                        hotmartProductId: 'WHITELIST', // Campo obrigatório
                        status: 'APPROVED',
                        // [FIX] paymentType e offerCode removidos pois não existem no schema Purchase
                        // Campos atualizados para compatibilidade com Schema v2
                        amount: 0,
                        currency: 'BRL',
                        productName: 'Acesso Manual (Whitelist)',
                        purchaseDate: new Date(),
                        approvedDate: new Date(),
                        buyerEmail: normalizedEmail, // Campo obrigatório (buyerEmail)
                        buyerName: targetUser.name || 'Whitelist User' // Campo obrigatório (buyerName)
                    }
                });
                console.log('💰 [WHITELIST] Compra manual criada para:', normalizedEmail);
            }
        }

        return NextResponse.json(newEntry);

    } catch (error) {
        console.error('Erro ao adicionar à whitelist:', error);
        return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }
}
