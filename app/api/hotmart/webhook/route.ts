import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
    validateHotmartWebhook,
    parseHotmartEvent,
    calculateExpirationDate,
    generateTemporaryPassword,
    isValidEmail,
    type HotmartWebhookPayload,
} from '@/app/lib/hotmart';
import {
    activateAccess,
    deactivateAccess,
    extendAccess,
} from '@/app/lib/subscription';

const prisma = new PrismaClient();

/**
 * POST /api/hotmart/webhook
 * 
 * Endpoint que recebe notificações da Hotmart quando:
 * - Uma compra é aprovada
 * - Uma compra é cancelada
 * - Um reembolso é solicitado
 * - Uma assinatura é renovada/cancelada
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Validar webhook Hotmart
        const hottok = request.headers.get('x-hotmart-hottok');

        if (!validateHotmartWebhook(hottok)) {
            console.error('❌ Webhook inválido - Token incorreto');
            return NextResponse.json(
                { error: 'Unauthorized - Invalid Hotmart token' },
                { status: 401 }
            );
        }

        // 2. Parse do payload
        const payload: HotmartWebhookPayload = await request.json();
        console.log('📥 Webhook recebido:', payload.event, payload.id);

        const parsedData = parseHotmartEvent(payload);

        // 3. Validar email
        if (!isValidEmail(parsedData.buyerEmail)) {
            console.error('❌ Email inválido:', parsedData.buyerEmail);
            return NextResponse.json(
                { error: 'Invalid email' },
                { status: 400 }
            );
        }

        // 4. Processar evento baseado no tipo
        switch (payload.event) {
            case 'PURCHASE_APPROVED':
            case 'PURCHASE_COMPLETE':
                await handlePurchaseApproved(parsedData);
                break;

            case 'PURCHASE_CANCELED':
            case 'SUBSCRIPTION_CANCELLATION':
                await handlePurchaseCanceled(parsedData);
                break;

            case 'PURCHASE_REFUNDED':
            case 'PURCHASE_CHARGEBACK':
                await handlePurchaseRefunded(parsedData);
                break;

            case 'SUBSCRIPTION_REACTIVATION':
                await handleSubscriptionReactivation(parsedData);
                break;

            default:
                console.warn('⚠️ Evento não tratado:', payload.event);
        }

        // 5. Retornar sucesso (Hotmart requer status 200)
        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully',
            event: payload.event,
            transactionId: parsedData.transactionId,
        });

    } catch (error) {
        console.error('❌ Erro ao processar webhook:', error);

        // Ainda retornar 200 para evitar reenvios da Hotmart
        // mas logar o erro para investigação
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

// ============================================
// 🟢 COMPRA APROVADA
// ============================================

async function handlePurchaseApproved(data: any) {
    console.log('✅ Processando compra aprovada:', data.transactionId);

    try {
        // Verificar se usuário já existe
        let user = await prisma.user.findUnique({
            where: { email: data.buyerEmail },
        });

        // Se não existe, criar novo usuário
        if (!user) {
            const temporaryPassword = generateTemporaryPassword();
            const passwordHash = await bcrypt.hash(temporaryPassword, 10);

            user = await prisma.user.create({
                data: {
                    email: data.buyerEmail,
                    name: data.buyerName,
                    passwordHash,
                    role: 'USER',
                    subscriptionStatus: 'active',
                    subscriptionExpiresAt: calculateExpirationDate(data.isRecurrent),
                    hasActiveSubscription: true,
                },
            });

            console.log('👤 Novo usuário criado:', user.id, user.email);
            console.log('🔑 Senha temporária gerada:', temporaryPassword);

            // TODO: Enviar email com credenciais
            // await sendWelcomeEmail(user.email, temporaryPassword);

        } else {
            // Usuário já existe - ativar/renovar acesso
            const expiresAt = calculateExpirationDate(data.isRecurrent);
            await activateAccess(user.id, expiresAt, 'active');

            console.log('🔄 Acesso renovado para usuário existente:', user.id);
        }

        // Registrar a compra
        await prisma.purchase.create({
            data: {
                userId: user.id,
                hotmartTransactionId: data.transactionId,
                hotmartProductId: data.productId,
                productName: data.productName,
                buyerEmail: data.buyerEmail,
                buyerName: data.buyerName,
                amount: data.amount,
                currency: data.currency,
                status: data.status,
                purchaseDate: data.purchaseDate,
                approvedDate: data.approvedDate,
                isRecurrent: data.isRecurrent,
                subscriptionId: data.subscriptionId,
                subscriptionStatus: data.subscriptionStatus,
                metadata: data.rawData,
            },
        });

        console.log('💾 Compra registrada no banco de dados');

    } catch (error) {
        console.error('❌ Erro ao processar compra aprovada:', error);
        throw error;
    }
}

// ============================================
// 🔴 COMPRA CANCELADA
// ============================================

async function handlePurchaseCanceled(data: any) {
    console.log('❌ Processando cancelamento:', data.transactionId);

    try {
        const user = await prisma.user.findUnique({
            where: { email: data.buyerEmail },
        });

        if (!user) {
            console.warn('⚠️ Usuário não encontrado para cancelamento:', data.buyerEmail);
            return;
        }

        // Desativar acesso
        await deactivateAccess(user.id, 'canceled');

        // Atualizar registro da compra
        await prisma.purchase.updateMany({
            where: {
                userId: user.id,
                hotmartTransactionId: data.transactionId,
            },
            data: {
                status: 'CANCELED',
            },
        });

        console.log('🔴 Acesso cancelado:', user.id);

    } catch (error) {
        console.error('❌ Erro ao processar cancelamento:', error);
        throw error;
    }
}

// ============================================
// 💰 REEMBOLSO
// ============================================

async function handlePurchaseRefunded(data: any) {
    console.log('💰 Processando reembolso:', data.transactionId);

    try {
        const user = await prisma.user.findUnique({
            where: { email: data.buyerEmail },
        });

        if (!user) {
            console.warn('⚠️ Usuário não encontrado para reembolso:', data.buyerEmail);
            return;
        }

        // Desativar acesso
        const reason = data.status === 'CHARGEBACK' ? 'chargeback' : 'refunded';
        await deactivateAccess(user.id, reason);

        // Atualizar registro da compra
        await prisma.purchase.updateMany({
            where: {
                userId: user.id,
                hotmartTransactionId: data.transactionId,
            },
            data: {
                status: data.status,
                refundedDate: new Date(),
            },
        });

        console.log('💰 Reembolso processado:', user.id);

    } catch (error) {
        console.error('❌ Erro ao processar reembolso:', error);
        throw error;
    }
}

// ============================================
// 🔄 REATIVAÇÃO DE ASSINATURA
// ============================================

async function handleSubscriptionReactivation(data: any) {
    console.log('🔄 Processando reativação de assinatura:', data.transactionId);

    try {
        const user = await prisma.user.findUnique({
            where: { email: data.buyerEmail },
        });

        if (!user) {
            console.warn('⚠️ Usuário não encontrado para reativação:', data.buyerEmail);
            return;
        }

        // Reativar acesso
        const expiresAt = calculateExpirationDate(true); // Assinatura recorrente
        await extendAccess(user.id, expiresAt);

        console.log('🔄 Assinatura reativada:', user.id);

    } catch (error) {
        console.error('❌ Erro ao processar reativação:', error);
        throw error;
    }
}
