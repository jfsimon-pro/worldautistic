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

        // 3. Validar email (exceto para cancelamentos que podem vir sem email)
        const isCancellation = payload.event === 'SUBSCRIPTION_CANCELLATION' || payload.event === 'PURCHASE_CANCELED';
        if (!isValidEmail(parsedData.buyerEmail) && !isCancellation) {
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
    if (!isValidEmail(data.buyerEmail)) {
        console.error('❌ Email inválido para aprovação:', data.buyerEmail);
        throw new Error('Email is required for APPROVED events');
    }

    console.log('✅ Processando compra aprovada:', data.transactionId);

    try {
        // Verificar se usuário já existe
        let user = await prisma.user.findUnique({
            where: { email: data.buyerEmail },
        });

        // Verificar se é o produto do Telegram
        const isTelegramProduct = Boolean(process.env.HOTMART_TELEGRAM_PRODUCT_ID &&
            data.productId === process.env.HOTMART_TELEGRAM_PRODUCT_ID);

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
                    subscriptionStatus: isTelegramProduct ? 'inactive' : 'active',
                    subscriptionExpiresAt: isTelegramProduct ? null : calculateExpirationDate(data.isRecurrent),
                    hasActiveSubscription: !isTelegramProduct,
                    hasTelegramAccess: isTelegramProduct,
                },
            });

            console.log('👤 Novo usuário criado:', user.id, user.email);
            console.log('🔑 Senha temporária gerada:', temporaryPassword);

            // TODO: Enviar email com credenciais
            // await sendWelcomeEmail(user.email, temporaryPassword);

        } else {
            // Usuário já existe - ativar/renovar acesso
            if (isTelegramProduct) {
                // Compra do Telegram - apenas ativar acesso ao grupo
                await prisma.user.update({
                    where: { id: user.id },
                    data: { hasTelegramAccess: true },
                });
                console.log('📱 Acesso ao Telegram ativado para usuário:', user.id);
            } else {
                // Compra do app - ativar assinatura
                const expiresAt = calculateExpirationDate(data.isRecurrent);
                await activateAccess(user.id, expiresAt, 'active');
                console.log('🔄 Acesso renovado para usuário existente:', user.id);
            }
        }


        // Sanitizar datas antes de salvar
        const sanitizeDate = (date: Date | undefined): Date | undefined => {
            if (!date) return undefined;
            const year = date.getFullYear();
            if (year > 3000 || year < 1900) return new Date();
            return date;
        };

        // Registrar ou atualizar a compra (Upsert)
        try {
            await prisma.purchase.upsert({
                where: { hotmartTransactionId: data.transactionId },
                update: {
                    status: data.status,
                    approvedDate: sanitizeDate(data.approvedDate),
                    subscriptionStatus: data.subscriptionStatus,
                    metadata: data.rawData,
                },
                create: {
                    userId: user.id,
                    hotmartTransactionId: data.transactionId,
                    hotmartProductId: data.productId,
                    productName: data.productName,
                    buyerEmail: data.buyerEmail,
                    buyerName: data.buyerName,
                    amount: data.amount,
                    currency: data.currency,
                    status: data.status,
                    purchaseDate: sanitizeDate(data.purchaseDate) || new Date(),
                    approvedDate: sanitizeDate(data.approvedDate),
                    isRecurrent: data.isRecurrent,
                    subscriptionId: data.subscriptionId,
                    subscriptionStatus: data.subscriptionStatus,
                    metadata: data.rawData,
                },
            });
            console.log('💾 Compra registrada/atualizada no banco de dados');
        } catch (purchaseError) {
            console.error('⚠️ Erro ao registrar compra (usuário já foi ativado):', purchaseError);
        }

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
        let user;

        // Tentar encontrar por email se válido
        if (isValidEmail(data.buyerEmail)) {
            user = await prisma.user.findUnique({
                where: { email: data.buyerEmail },
            });
        }

        // Se não achou por email, tentar encontrar por transação ou assinatura
        if (!user) {
            console.log('🔍 Buscando usuário por transação anterior ou assinatura...');
            const purchase = await prisma.purchase.findFirst({
                where: {
                    OR: [
                        { hotmartTransactionId: data.transactionId },
                        { subscriptionId: data.transactionId } // Fallback ID pode ser a assinatura
                    ]
                },
                include: { user: true }
            });

            if (purchase) {
                user = purchase.user;
                console.log('✅ Usuário encontrado via histórico de compra:', user.email);
            }
        }

        if (!user) {
            console.warn('⚠️ Usuário não encontrado para cancelamento. Email:', data.buyerEmail, 'ID:', data.transactionId);
            return;
        }

        // Desativar acesso
        await deactivateAccess(user.id, 'canceled');

        // FORÇAR atualização no user também (Redundância necessária)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                subscriptionStatus: 'canceled',
                hasActiveSubscription: false
            } as any
        });

        // Atualizar registro da compra se existir
        const purchaseExists = await prisma.purchase.findUnique({
            where: { hotmartTransactionId: data.transactionId }
        });

        if (purchaseExists) {
            await prisma.purchase.update({
                where: { hotmartTransactionId: data.transactionId },
                data: { status: 'CANCELED' }
            });
        }

        console.log('🔴 Acesso cancelado (Forçado):', user.id);

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

        // FORÇAR atualização no user também (Redundância necessária)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                subscriptionStatus: reason,
                hasActiveSubscription: false
            } as any
        });

        // Atualizar registro da compra
        // Tentar encontrar compra por Transaction ID ou Subscription ID
        const whereClause: any = {
            userId: user.id,
            OR: [
                { hotmartTransactionId: data.transactionId },
            ]
        };

        if (data.subscriptionId) {
            whereClause.OR.push({ subscriptionId: data.subscriptionId });
        }

        const updateResult = await prisma.purchase.updateMany({
            where: whereClause,
            data: {
                status: data.status,
                refundedDate: new Date(),
            },
        });

        if (updateResult.count === 0) {
            console.warn('⚠️ Nenhuma compra encontrada por ID exato/Assinatura. Tentando fallback para última compra aprovada...');

            // Fallback: Pegar a última compra aprovada do usuário
            // Útil para vendas avulsas onde o ID da transação de reembolso pode diferir
            const lastPurchase = await prisma.purchase.findFirst({
                where: {
                    userId: user.id,
                    status: { in: ['APPROVED', 'COMPLETE'] }
                },
                orderBy: { createdAt: 'desc' }
            });

            if (lastPurchase) {
                await prisma.purchase.update({
                    where: { id: lastPurchase.id },
                    data: {
                        status: data.status,
                        refundedDate: new Date(),
                    }
                });
                console.log(`💰 Fallback: Compra ${lastPurchase.hotmartTransactionId} marcada como ${data.status}`);
            } else {
                console.warn('⚠️ Fallback falhou: Nenhuma compra aprovada encontrada para este usuário.');
            }
        } else {
            console.log(`💰 Status da compra atualizado para ${data.status} (${updateResult.count} registros)`);
        }

        console.log('💰 Reembolso processado (Forçado):', user.id);

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
