# 📊 Diagrama de Entidade-Relacionamento - World Autistic

```mermaid
erDiagram
    User ||--o{ ActivityProgress : "completes"
    User ||--o{ GameProgress : "plays"
    User ||--o{ UserAchievement : "unlocks"
    User ||--o{ UserStreak : "has"
    User ||--o{ DailyActivity : "tracks"
    
    Achievement ||--o{ UserAchievement : "awarded-to"
    
    Card {
        string id PK
        enum category
        string identifier UK
        string namePt
        string nameEn
        string nameEs
        string imageUrl
        string audioPt
        string color
        boolean isActive
    }
    
    Activity ||--o{ ActivityProgress : "tracked-in"
    Activity {
        string id PK
        enum type
        enum level
        string componentName
        string title
        json config
        boolean isActive
    }
    
    ActivityProgress {
        string id PK
        string userId FK
        string activityId FK
        int attempts
        int correctAnswers
        int incorrectAnswers
        float score
        boolean isCompleted
        datetime completedAt
    }
    
    Game ||--o{ GameProgress : "tracked-in"
    Game {
        string id PK
        enum type
        string name
        json config
        boolean isActive
    }
    
    GameProgress {
        string id PK
        string userId FK
        string gameId FK
        int attempts
        int wins
        int bestScore
        datetime lastPlayedAt
    }
    
    FrequencyCategory ||--o{ Frequency : "contains"
    FrequencyCategory {
        string id PK
        string name UK
        string assetFolder
        boolean isActive
    }
    
    Frequency {
        string id PK
        string categoryId FK
        string name
        string publicId UK
        string secureUrl
        int playCount
    }
    
    Story {
        string id PK
        enum type
        string title
        text content
        string coverImage
        array tags
        boolean isDraft
    }
    
    UserAchievement {
        string id PK
        string userId FK
        string achievementId FK
        datetime unlockedAt
    }
    
    Achievement {
        string id PK
        string name
        enum type
        json criteria
        int points
    }
    
    UserStreak {
        string id PK
        string userId FK UK
        int currentStreak
        int longestStreak
        datetime lastActiveDate
    }
    
    DailyActivity {
        string id PK
        string userId FK
        date date
        int activitiesCompleted
        int gamesPlayed
        int totalTimeSpent
    }
    
    User {
        string id PK
        string email UK
        string passwordHash
        string name
        enum role
        string language
        datetime lastLoginAt
    }
```

---

## 🎨 Relacionamentos Principais

### 👨‍💼 Hierarquia de Usuários

```
ADMIN
  ├─ Gerencia todo o sistema
  ├─ Acesso ao painel administrativo
  ├─ CRUD de todos os conteúdos
  └─ Visualiza analytics gerais

USER
  ├─ Usa a plataforma educacional
  ├─ Completa atividades e jogos
  ├─ Desbloqueia conquistas
  └─ Vê seu próprio progresso
```

---

## 📈 Fluxo de Progresso do Usuário

```
Child User
    │
    ├──► Completa Atividade
    │       └──► ActivityProgress criado
    │              ├──► Score calculado
    │              ├──► Tempo registrado
    │              └──► DailyActivity atualizado
    │
    ├──► Joga Game
    │       └──► GameProgress atualizado
    │              ├──► Wins/Losses
    │              └──► Best Score
    │
    ├──► Mantém Streak
    │       └──► UserStreak atualizado
    │              ├──► currentStreak++
    │              └──► Pode desbloquear Achievement
    │
    └──► Desbloqueia Achievement
            └──► UserAchievement criado
                   └──► Pontos somados
```

---

## 🎯 Sistema de Conquistas

```
Achievement Types:
┌─────────────────────────────────────────────────────────┐
│ ACTIVITY_COMPLETION  → Complete X atividades            │
│ STREAK               → X dias consecutivos              │
│ PERFECT_SCORE        → 100% em uma atividade            │
│ TIME_BASED           → Complete em menos de X segundos  │
│ CATEGORY_MASTER      → Complete todas de uma categoria │
│ SPECIAL              → Eventos especiais/sazonais       │
└─────────────────────────────────────────────────────────┘

Critérios flexíveis em JSON:
{
  "activitiesCompleted": 10,
  "minScore": 90,
  "category": "ANIMALS"
}
```

---

## 📚 Conteúdo Multilíngue

Todos os modelos de conteúdo suportam 3 idiomas:

```
português (PT) - Padrão
english (EN)   - Traduções
español (ES)   - Traduções

Campos afetados:
├─ Card (namePt, nameEn, nameEs)
├─ Activity (title, description)
├─ Game (name, description)
├─ Achievement (name, description)
├─ FrequencyCategory (name, description)
└─ Story (title, content)
```

---

## 🎵 Integração Cloudinary

```
FrequencyCategory
    ↓
    assetFolder = "relaxamento"
    ↓
Cloudinary API
    ↓
Frequency records criados
    ├─ publicId
    ├─ secureUrl
    └─ metadata
```

---

## 📊 Analytics e Relatórios

### DailyActivity
Resumo diário agregado de todas as atividades do usuário.

```typescript
// Exemplo de relatório semanal
const weeklyData = await prisma.dailyActivity.groupBy({
  by: ['userId'],
  where: { 
    date: { gte: lastWeek, lte: today }
  },
  _sum: {
    activitiesCompleted: true,
    totalTimeSpent: true,
  }
});
```

### UserStreak
Sistema de engajamento baseado em sequências.

---

## 🔐 Autenticação (Futuro com NextAuth)

```typescript
// Exemplo de integração com NextAuth
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // Login com email/password
    }),
  ],
};
```

---

## 📦 Índices e Performance

Índices criados para otimização:

```
User
├─ @@index([email])
├─ @@index([role])
├─ @@index([parentId])
└─ @@index([therapistId])

ActivityProgress
├─ @@index([userId])
├─ @@index([activityId])
└─ @@index([isCompleted])

Card
├─ @@index([category])
└─ @@index([isActive])

... e mais
```

---

## 🚀 Queries Otimizadas

### Dashboard do Admin

```typescript
// Estatísticas gerais
const stats = await prisma.$transaction([
  prisma.card.count({ where: { isActive: true } }),
  prisma.user.count({ where: { role: 'CHILD' } }),
  prisma.activity.count({ where: { isActive: true } }),
  prisma.activityProgress.aggregate({
    _avg: { score: true },
    where: { isCompleted: true }
  }),
]);
```

### Progresso do Child

```typescript
// Progresso completo de um child
const childProgress = await prisma.user.findUnique({
  where: { id: childId },
  include: {
    activityProgress: {
      include: { activity: true },
      orderBy: { completedAt: 'desc' }
    },
    gameProgress: {
      include: { game: true }
    },
    achievements: {
      include: { achievement: true }
    },
    userStreaks: true,
  }
});
```

---

## 🎨 Visualização das Tabelas

### Tabela central: **User**
```
┌─────────────────────────────────────────┐
│ User                                    │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ email (UK)                              │
│ passwordHash                            │
│ name                                    │
│ role (ADMIN|PARENT|THERAPIST|CHILD)    │
│ parentId (FK → User)                    │
│ therapistId (FK → User)                 │
│ language (pt|en|es)                     │
│ ...timestamps                           │
└─────────────────────────────────────────┘
        ↓ (1:N)
┌─────────────────────────────────────────┐
│ ActivityProgress                        │
│ GameProgress                            │
│ UserAchievement                         │
│ UserStreak                              │
│ DailyActivity                           │
└─────────────────────────────────────────┘
```

---

Este diagrama representa a estrutura completa do banco de dados e seus relacionamentos! 🎉
