import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

export async function GET(request: NextRequest) {
    try {
        // Verificar autenticação
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        // Buscar estatísticas
        const [
            totalUsers,
            totalActivities,
            totalGames,
            totalCards,
            totalAchievements,
            recentUsers,
            topStreaks,
            activitiesCompleted,
        ] = await Promise.all([
            // Total de usuários
            prisma.user.count(),

            // Total de atividades
            prisma.activity.count({ where: { isActive: true } }),

            // Total de jogos
            prisma.game.count({ where: { isActive: true } }),

            // Total de cards
            prisma.card.count({ where: { isActive: true } }),

            // Total de conquistas
            prisma.achievement.count(),

            // Usuários recentes (últimos 7 dias)
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),

            // Top 5 usuários por streak
            prisma.userStreak.findMany({
                take: 5,
                orderBy: { currentStreak: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                },
            }),

            // Total de atividades completadas
            prisma.activityProgress.count({
                where: { isCompleted: true },
            }),
        ]);

        // Usuários ativos (últimos 7 dias)
        const activeUsers = await prisma.user.count({
            where: {
                lastLoginAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                recent: recentUsers,
            },
            content: {
                activities: totalActivities,
                games: totalGames,
                cards: totalCards,
                achievements: totalAchievements,
            },
            engagement: {
                activitiesCompleted,
                topStreaks: topStreaks.map(streak => ({
                    userName: streak.user.name,
                    currentStreak: streak.currentStreak,
                    longestStreak: streak.longestStreak,
                })),
            },
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar estatísticas' },
            { status: 500 }
        );
    }
}
