# 🔌 Exemplos de API Routes - World Autistic

Este arquivo contém exemplos práticos de API routes para integrar o Prisma com Next.js.

---

## 📁 Estrutura Sugerida de API Routes

```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── cards/
│   ├── route.ts                    # GET /api/cards?category=ANIMALS
│   └── [id]/route.ts               # GET/PUT/DELETE /api/cards/:id
├── activities/
│   ├── route.ts                    # GET /api/activities
│   ├── [id]/route.ts               # GET /api/activities/:id
│   └── progress/route.ts           # POST /api/activities/progress
├── games/
│   ├── route.ts                    # GET /api/games
│   └── [id]/progress/route.ts     # POST /api/games/:id/progress
├── users/
│   ├── [id]/
│   │   ├── route.ts               # GET/PUT /api/users/:id
│   │   ├── progress/route.ts      # GET /api/users/:id/progress
│   │   ├── achievements/route.ts  # GET /api/users/:id/achievements
│   │   └── stats/route.ts         # GET /api/users/:id/stats
│   └── me/route.ts                # GET /api/users/me
├── frequencies/
│   └── route.ts                    # GET /api/frequencies?category=xxx
├── stories/
│   ├── route.ts                    # GET /api/stories
│   └── [id]/route.ts               # GET /api/stories/:id
└── admin/
    ├── dashboard/route.ts          # GET /api/admin/dashboard
    └── analytics/route.ts          # GET /api/admin/analytics
```

---

## 📝 Exemplos de Implementação

### 1. `/app/api/cards/route.ts`

Buscar cards por categoria com suporte multilíngue.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const lang = searchParams.get('lang') || 'pt';

  try {
    const cards = await prisma.card.findMany({
      where: {
        ...(category && { category: category.toUpperCase() as any }),
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    // Transformar dados baseado no idioma
    const transformedCards = cards.map(card => ({
      id: card.id,
      identifier: card.identifier,
      category: card.category,
      name: card[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof typeof card] || card.namePt,
      imageUrl: card.imageUrl,
      audioUrl: card[`audio${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof typeof card] || card.audioPt,
      color: card.color,
      borderColor: card.borderColor,
      textColor: card.textColor,
    }));

    return NextResponse.json(transformedCards);
  } catch (error) {
    console.error('Erro ao buscar cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const card = await prisma.card.create({
      data: {
        category: body.category,
        identifier: body.identifier,
        namePt: body.namePt,
        nameEn: body.nameEn,
        nameEs: body.nameEs,
        imageUrl: body.imageUrl,
        audioPt: body.audioPt,
        audioEn: body.audioEn,
        audioEs: body.audioEs,
        color: body.color,
        borderColor: body.borderColor,
        textColor: body.textColor,
        order: body.order || 0,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
```

---

### 2. `/app/api/activities/progress/route.ts`

Registrar progresso de uma atividade.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityId, correctAnswers, incorrectAnswers, completionTime } = body;

    const totalQuestions = correctAnswers + incorrectAnswers;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const isCompleted = score >= 60; // 60% para considerar completo

    // Criar progresso da atividade
    const progress = await prisma.activityProgress.create({
      data: {
        userId,
        activityId,
        attempts: 1,
        correctAnswers,
        incorrectAnswers,
        completionTime,
        score,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Atualizar atividade diária
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        activitiesCompleted: { increment: isCompleted ? 1 : 0 },
        totalTimeSpent: { increment: completionTime || 0 },
        correctAnswers: { increment: correctAnswers },
        incorrectAnswers: { increment: incorrectAnswers },
      },
      create: {
        userId,
        date: today,
        activitiesCompleted: isCompleted ? 1 : 0,
        totalTimeSpent: completionTime || 0,
        correctAnswers,
        incorrectAnswers,
      },
    });

    // Atualizar streak
    await updateUserStreak(userId);

    // Verificar achievements
    await checkAchievements(userId, progress);

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar progresso:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

async function updateUserStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      },
    });
    return;
  }

  const lastActive = new Date(streak.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  if (lastActive.getTime() === yesterday.getTime()) {
    // Continua o streak
    const newStreak = streak.currentStreak + 1;
    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActiveDate: today,
      },
    });
  } else if (lastActive.getTime() < yesterday.getTime()) {
    // Streak quebrado
    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActiveDate: today,
      },
    });
  }
  // Se lastActive === today, não faz nada (já atualizou hoje)
}

async function checkAchievements(userId: string, progress: any) {
  // Exemplo: Achievement de primeira atividade
  const totalCompleted = await prisma.activityProgress.count({
    where: { userId, isCompleted: true },
  });

  if (totalCompleted === 1) {
    const achievement = await prisma.achievement.findFirst({
      where: { criteria: { path: ['activitiesCompleted'], equals: 1 } },
    });

    if (achievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      }).catch(() => {}); // Ignora se já existe
    }
  }

  // Exemplo: Achievement de score perfeito
  if (progress.score === 100) {
    const perfectScoreAchievement = await prisma.achievement.findFirst({
      where: { type: 'PERFECT_SCORE' },
    });

    if (perfectScoreAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: perfectScoreAchievement.id,
        },
      }).catch(() => {});
    }
  }
}
```

---

### 3. `/app/api/users/[id]/progress/route.ts`

Buscar progresso completo de um usuário.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    const [activityProgress, gameProgress, achievements, streak] = await Promise.all([
      prisma.activityProgress.findMany({
        where: { userId },
        include: { activity: true },
        orderBy: { lastAttemptAt: 'desc' },
        take: 20,
      }),
      prisma.gameProgress.findMany({
        where: { userId },
        include: { game: true },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      }),
      prisma.userStreak.findUnique({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      activityProgress,
      gameProgress,
      achievements,
      streak,
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
```

---

### 4. `/app/api/users/[id]/stats/route.ts`

Dashboard de estatísticas do usuário.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // Últimos 7 dias
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const [
      totalActivitiesCompleted,
      totalGamesPlayed,
      averageScore,
      totalAchievements,
      weeklyActivity,
      streak,
    ] = await Promise.all([
      prisma.activityProgress.count({
        where: { userId, isCompleted: true },
      }),
      prisma.gameProgress.aggregate({
        where: { userId },
        _sum: { attempts: true },
      }),
      prisma.activityProgress.aggregate({
        where: { userId, isCompleted: true },
        _avg: { score: true },
      }),
      prisma.userAchievement.count({
        where: { userId },
      }),
      prisma.dailyActivity.findMany({
        where: {
          userId,
          date: { gte: last7Days },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.userStreak.findUnique({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalActivitiesCompleted,
        totalGamesPlayed: totalGamesPlayed._sum.attempts || 0,
        averageScore: Math.round(averageScore._avg.score || 0),
        totalAchievements,
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
      },
      weeklyActivity,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
```

---

### 5. `/app/api/admin/dashboard/route.ts`

Dashboard administrativo com métricas gerais.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [
      totalUsers,
      activeUsers,
      totalCards,
      totalActivities,
      totalGames,
      recentActivities,
      stats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
          },
        },
      }),
      prisma.card.count({ where: { isActive: true } }),
      prisma.activity.count({ where: { isActive: true } }),
      prisma.game.count({ where: { isActive: true } }),
      prisma.activityProgress.findMany({
        where: { isCompleted: true },
        include: {
          user: { select: { name: true } },
          activity: { select: { title: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      }),
      prisma.activityProgress.aggregate({
        where: { isCompleted: true },
        _avg: { score: true },
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalCards,
        totalActivities,
        totalGames,
        averageCompletionRate: Math.round(stats._avg.score || 0),
      },
      recentActivities,
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
```

---

## 🔐 Middleware de Autenticação (Exemplo)

### `/middleware.ts` (na raiz do projeto)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se possui token (exemplo simplificado)
  const token = request.cookies.get('auth-token');

  if (!token && request.nextUrl.pathname.startsWith('/api/admin')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/users/:path*'],
};
```

---

## 🎯 Hooks Personalizados (Cliente)

### `hooks/useCards.ts`

```typescript
import { useEffect, useState } from 'react';

export function useCards(category?: string) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const url = category 
        ? `/api/cards?category=${category}`
        : '/api/cards';
      
      const response = await fetch(url);
      const data = await response.json();
      setCards(data);
      setLoading(false);
    };

    fetchCards();
  }, [category]);

  return { cards, loading };
}
```

---

## ✅ Próximos Passos

1. Criar `lib/prisma.ts` (singleton do Prisma Client)
2. Implementar as API routes acima
3. Integrar com NextAuth.js para autenticação real
4. Adicionar validação de dados (Zod)
5. Implementar rate limiting
6. Adicionar testes (Jest + Supertest)

---

**Dica:** Use ferramentas como **Postman** ou **Thunder Client** (VS Code) para testar as API routes!
