import prisma from './prisma';

/**
 * Atualiza o streak do usuário baseado na data do último login
 * Lógica:
 * - Se última atividade foi ONTEM → incrementa streak
 * - Se última atividade foi HOJE → não muda
 * - Se última atividade foi > 1 dia atrás → reseta para 1
 * - Atualiza longestStreak se necessário
 */
export async function updateUserStreak(userId: string): Promise<void> {
    try {
        // Buscar ou criar streak do usuário
        let userStreak = await prisma.userStreak.findUnique({
            where: { userId },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas datas

        if (!userStreak) {
            // Criar streak inicial se não existir
            await prisma.userStreak.create({
                data: {
                    userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActiveDate: new Date(),
                },
            });
            console.log(`✅ Streak criado para usuário ${userId}: 1 dia`);
            return;
        }

        const lastActiveDate = new Date(userStreak.lastActiveDate);
        lastActiveDate.setHours(0, 0, 0, 0); // Zerar horas

        const diffInDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`📊 Streak check - UserId: ${userId}, Diff: ${diffInDays} dias, Current: ${userStreak.currentStreak}`);

        if (diffInDays === 0) {
            // Já logou hoje
            if (userStreak.currentStreak === 0) {
                // Se streak está em 0 mas está logando hoje, corrigir para 1
                await prisma.userStreak.update({
                    where: { userId },
                    data: {
                        currentStreak: 1,
                        longestStreak: Math.max(1, userStreak.longestStreak),
                        lastActiveDate: new Date(),
                    },
                });
                console.log(`✅ Streak corrigido de 0 para 1`);
            } else {
                console.log(`✅ Usuário já ativo hoje, streak mantido: ${userStreak.currentStreak}`);
            }
            return;
        } else if (diffInDays === 1) {
            // Último login foi ONTEM → incrementa streak
            const newStreak = userStreak.currentStreak + 1;
            const newLongest = Math.max(newStreak, userStreak.longestStreak);

            await prisma.userStreak.update({
                where: { userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak: newLongest,
                    lastActiveDate: new Date(),
                },
            });

            console.log(`🔥 Streak incrementado! ${userStreak.currentStreak} → ${newStreak} dias`);
            if (newStreak > userStreak.longestStreak) {
                console.log(`🏆 NOVO RECORDE! ${newLongest} dias`);
            }
        } else {
            // Passou mais de 1 dia → reseta streak
            await prisma.userStreak.update({
                where: { userId },
                data: {
                    currentStreak: 1,
                    lastActiveDate: new Date(),
                },
            });

            console.log(`💔 Streak resetado (estava em ${userStreak.currentStreak}, passou ${diffInDays} dias sem login)`);
        }
    } catch (error) {
        console.error('Erro ao atualizar streak:', error);
        // Não bloqueia o login se falhar
    }
}
