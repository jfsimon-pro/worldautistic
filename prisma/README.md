# 🗄️ Database Schema - World Autistic

## 📋 Visão Geral

Este schema Prisma foi projetado para suportar todas as funcionalidades do **World Autistic**, uma plataforma educacional multilíngue voltada para suporte ao autismo.

## 🏗️ Estrutura do Banco de Dados

### 👤 Autenticação e Usuários

#### `User`
Sistema de usuários com 2 roles: **ADMIN** e **USER**.

**Roles disponíveis:**
- `ADMIN` - Administrador do sistema (acesso ao painel admin completo)
- `USER` - Usuário comum (uso da plataforma educacional)

**Recursos:**
- ✅ Autenticação com email e senha
- ✅ Configurações personalizadas (idioma PT/EN/ES, som)
- ✅ Avatar e informações pessoais
- ✅ Tracking de último login
- ✅ Progresso completo de atividades e jogos

---

### 🎯 Sistema de Conquistas

#### `Achievement` & `UserAchievement`
Sistema gamificado de conquistas para engajamento e motivação.

**Tipos de conquistas:**
- `ACTIVITY_COMPLETION` - Completar atividades
- `STREAK` - Manter sequências de dias ativos
- `PERFECT_SCORE` - Acertar todas as questões
- `TIME_BASED` - Realizar tarefas em tempo recorde
- `CATEGORY_MASTER` - Dominar uma categoria específica
- `SPECIAL` - Conquistas especiais/sazonais

**Recursos:**
- ✅ Sistemas de pontos
- ✅ Multilíngue (PT/EN/ES)
- ✅ Critérios flexíveis em JSON
- ✅ Tracking de data de desbloqueio

---

### 📚 Conteúdo - Cards Interativos

#### `Card`
Cards de aprendizado com imagens, áudio e conteúdo multilíngue.

**Categorias:**
- `ANIMALS` - Animais (48 cards)
- `FOOD` - Comidas
- `OBJECTS` - Objetos
- `COLORS` - Cores
- `COMMANDS` - Comandos de voz

**Recursos:**
- ✅ Nomes em 3 idiomas (PT/EN/ES)
- ✅ Áudio multilíngue
- ✅ Customização de cores (background, borda, texto)
- ✅ Sistema de ordenação
- ✅ Ativação/desativação flexível

**Exemplo de uso:**
```typescript
const elephant = await prisma.card.create({
  data: {
    category: 'ANIMALS',
    identifier: 'elephant',
    namePt: 'Elefante',
    nameEn: 'Elephant',
    nameEs: 'Elefante',
    imageUrl: '/images/animals/elephant.png',
    audioPt: '/audio/pt/animals/Elephant_.mp3',
    color: '#AAD3E9',
    borderColor: '#56A9D4',
    textColor: '#090889',
  }
});
```

---

### ✏️ Atividades Educacionais

#### `Activity` & `ActivityProgress`
Sistema completo de atividades interativas com tracking de progresso.

**Tipos de atividades:**

**Matemática:**
- `MATH_ADDITION` - Adição
- `MATH_SUBTRACTION` - Subtração
- `MATH_MULTIPLICATION` - Multiplicação
- `MATH_DIVISION` - Divisão
- `MATH_COMPARISON` - Comparação de números
- `MATH_SEQUENCES` - Sequências numéricas

**Linguagem:**
- `LANG_LETTER_RECOGNITION` - Reconhecimento de letras
- `LANG_WORD_BUILDING` - Construção de palavras
- `LANG_READING_COMPREHENSION` - Compreensão de leitura

**Níveis de dificuldade:**
- `LEVEL_1` - Básico
- `LEVEL_2` - Intermediário
- `LEVEL_3` - Avançado

**Métricas rastreadas:**
- ✅ Tentativas
- ✅ Respostas corretas/incorretas
- ✅ Tempo de conclusão
- ✅ Score (porcentagem)
- ✅ Data de conclusão

**Exemplo de consulta:**
```typescript
// Buscar progresso de um usuário em atividades de matemática nível 1
const progress = await prisma.activityProgress.findMany({
  where: {
    userId: 'user-id',
    activity: {
      type: { startsWith: 'MATH_' },
      level: 'LEVEL_1'
    }
  },
  include: {
    activity: true
  }
});
```

---

### 🎮 Jogos

#### `Game` & `GameProgress`
Sistema de jogos educativos com tracking de desempenho.

**Tipos de jogos:**
- `MEMORY_GAME` - Jogo da memória
- `PUZZLE` - Quebra-cabeças
- `MATCHING` - Jogo de correspondências
- `SORTING` - Jogo de ordenação

**Métricas:**
- ✅ Tentativas totais
- ✅ Vitórias/derrotas
- ✅ Melhor pontuação
- ✅ Melhor tempo
- ✅ Última vez jogado

---

### 🎵 Frequências Sonoras

#### `FrequencyCategory` & `Frequency`
Integração com Cloudinary para armazenamento e streaming de áudio.

**Recursos:**
- ✅ Categorias organizadas (Relaxamento, Foco, etc.)
- ✅ Integração com Cloudinary
- ✅ Multilíngue
- ✅ Tracking de reproduções
- ✅ Metadados (duração, frequência Hz)

**Exemplo de seed:**
```typescript
const relaxCategory = await prisma.frequencyCategory.create({
  data: {
    name: 'Relaxamento',
    nameEn: 'Relaxation',
    nameEs: 'Relajación',
    assetFolder: 'relaxamento',
    icon: '🧘',
  }
});

await prisma.frequency.create({
  data: {
    categoryId: relaxCategory.id,
    name: '432Hz - Frequência do Universo',
    frequency: '432Hz',
    publicId: 'frequencies/relaxamento/432hz',
    secureUrl: 'https://res.cloudinary.com/.../432hz.mp3',
    duration: 300,
  }
});
```

---

### 📖 Histórias e Rotinas

#### `Story`
Sistema de histórias sociais e rotinas visuais.

**Tipos de conteúdo:**
- `STORY` - Histórias educativas
- `ROUTINE` - Rotinas visuais (rotina matinal, ir à escola, etc.)
- `SOCIAL_SCRIPT` - Scripts sociais (como cumprimentar, pedir ajuda, etc.)

**Recursos:**
- ✅ Conteúdo em markdown/HTML
- ✅ Multilíngue
- ✅ Imagens de capa e galerias
- ✅ Sistema de tags
- ✅ Faixa etária recomendada
- ✅ Modo rascunho

---

### 📊 Analytics e Relatórios

#### `UserStreak`
Tracking de sequências de dias ativos.

#### `DailyActivity`
Métricas diárias detalhadas de uso da plataforma.

**Métricas rastreadas:**
- ✅ Atividades completadas
- ✅ Jogos jogados
- ✅ Tempo total gasto
- ✅ Respostas corretas/incorretas
- ✅ Breakdown por categoria (math, lang, cards, frequencies)

**Exemplo de relatório semanal:**
```typescript
const weeklyReport = await prisma.dailyActivity.findMany({
  where: {
    userId: 'user-id',
    date: {
      gte: new Date('2026-01-01'),
      lte: new Date('2026-01-07'),
    }
  },
  orderBy: { date: 'asc' }
});
```

---

### 📢 Notificações

#### `Notification`
Sistema de notificações para usuários.

**Tipos:**
- `ACHIEVEMENT` - Conquista desbloqueada
- `REMINDER` - Lembretes de atividades
- `PROGRESS_REPORT` - Relatórios de progresso
- `SYSTEM` - Notificações do sistema

---

## 🚀 Setup e Instalação

### 1. Instalar Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Configurar variável de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/world_autistic?schema=public"
```

### 3. Executar migrations

```bash
npx prisma migrate dev --name init
```

### 4. Gerar Prisma Client

```bash
npx prisma generate
```

### 5. (Opcional) Visualizar banco com Prisma Studio

```bash
npx prisma studio
```

---

## 📦 Exemplo de Seed

Vou criar um arquivo `prisma/seed.ts` separado com exemplos de dados iniciais.

---

## 🔍 Queries Úteis

### Buscar usuário com progresso de atividades
```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    activityProgress: {
      include: { activity: true }
    },
    achievements: {
      include: { achievement: true }
    },
    userStreaks: true,
  }
});
```

### Dashboard de analytics
```typescript
const analytics = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    activityProgress: {
      where: { isCompleted: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    },
    gameProgress: true,
    userStreaks: true,
  }
});
```

### Cards de uma categoria específica
```typescript
const animals = await prisma.card.findMany({
  where: {
    category: 'ANIMALS',
    isActive: true,
  },
  orderBy: { order: 'asc' }
});
```

---

## 🎨 Próximos Passos

1. ✅ Schema criado
2. ⏳ Criar arquivo de seed com dados de exemplo
3. ⏳ Configurar Prisma Client no projeto Next.js
4. ⏳ Criar API routes para CRUD de cada modelo
5. ⏳ Implementar autenticação (NextAuth.js + Prisma Adapter)
6. ⏳ Migrar dados estáticos (JSON) para o banco de dados

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js + Prisma](https://www.prisma.io/nextjs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
