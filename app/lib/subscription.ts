import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// ✅ VERIFICAÇÃO DE ACESSO
// ============================================

/**
 * Verifica se usuário tem acesso ativo ao sistema
 * Considera tanto o status quanto a data de expiração
 */
export async function hasActiveAccess(userId: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                hasActiveSubscription: true,
                subscriptionStatus: true,
                subscriptionExpiresAt: true,
            },
        });

        if (!user) {
            return false;
        }

        // Verificar se tem assinatura ativa
        if (!user.hasActiveSubscription) {
            return false;
        }

        // Verificar se status é ativo
        if (user.subscriptionStatus !== 'active') {
            return false;
        }

        // Verificar se não expirou
        if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
            // Expirou - desativar automaticamente
            await deactivateAccess(userId, 'expired');
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Erro ao verificar acesso:', error);
        return false;
    }
}

/**
 * Verifica acesso por email (útil antes do login)
 */
export async function hasActiveAccessByEmail(email: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: { id: true },
        });

        if (!user) {
            return false;
        }

        return hasActiveAccess(user.id);
    } catch (error) {
        console.error('❌ Erro ao verificar acesso por email:', error);
        return false;
    }
}

// ============================================
// 🟢 ATIVAÇÃO DE ACESSO
// ============================================

/**
 * Ativa acesso do usuário após compra aprovada
 */
export async function activateAccess(
    userId: string,
    expiresAt: Date,
    status: string = 'active'
): Promise<void> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionStatus: status,
                subscriptionExpiresAt: expiresAt,
                hasActiveSubscription: true,
            },
        });

        console.log(`✅ Acesso ativado para usuário ${userId} até ${expiresAt.toISOString()}`);
    } catch (error) {
        console.error('❌ Erro ao ativar acesso:', error);
        throw error;
    }
}

// ============================================
// 🔴 DESATIVAÇÃO DE ACESSO
// ============================================

/**
 * Desativa acesso do usuário (cancelamento, reembolso, expiração)
 */
export async function deactivateAccess(
    userId: string,
    reason: 'canceled' | 'refunded' | 'expired' | 'chargeback' = 'canceled'
): Promise<void> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionStatus: reason,
                hasActiveSubscription: false,
            },
        });

        console.log(`🔴 Acesso desativado para usuário ${userId} - Motivo: ${reason}`);
    } catch (error) {
        console.error('❌ Erro ao desativar acesso:', error);
        throw error;
    }
}

// ============================================
// 🔄 EXTENSÃO DE ACESSO
// ============================================

/**
 * Estende período de acesso (renovação de assinatura)
 */
export async function extendAccess(
    userId: string,
    newExpirationDate: Date
): Promise<void> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionExpiresAt: newExpirationDate,
                subscriptionStatus: 'active',
                hasActiveSubscription: true,
            },
        });

        console.log(`🔄 Acesso estendido para usuário ${userId} até ${newExpirationDate.toISOString()}`);
    } catch (error) {
        console.error('❌ Erro ao estender acesso:', error);
        throw error;
    }
}

// ============================================
// 📊 ESTATÍSTICAS DE ASSINATURA
// ============================================

/**
 * Retorna estatísticas de assinaturas
 */
export async function getSubscriptionStats() {
    try {
        const [total, active, inactive, expired] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    hasActiveSubscription: true,
                    subscriptionStatus: 'active',
                },
            }),
            prisma.user.count({
                where: {
                    hasActiveSubscription: false,
                },
            }),
            prisma.user.count({
                where: {
                    subscriptionExpiresAt: {
                        lt: new Date(),
                    },
                },
            }),
        ]);

        return {
            total,
            active,
            inactive,
            expired,
            activePercentage: total > 0 ? (active / total) * 100 : 0,
        };
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error);
        throw error;
    }
}

/**
 * Lista usuários com assinatura expirando em breve
 */
export async function getUsersExpiringSoon(daysAhead: number = 7) {
    try {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        const users = await prisma.user.findMany({
            where: {
                hasActiveSubscription: true,
                subscriptionExpiresAt: {
                    lte: futureDate,
                    gte: new Date(),
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                subscriptionExpiresAt: true,
            },
            orderBy: {
                subscriptionExpiresAt: 'asc',
            },
        });

        return users;
    } catch (error) {
        console.error('❌ Erro ao buscar usuários expirando:', error);
        throw error;
    }
}
