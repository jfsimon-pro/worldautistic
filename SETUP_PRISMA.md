# 🚀 Guia de Setup - Prisma + PostgreSQL

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL instalado localmente OU conta no [Supabase](https://supabase.com) / [Neon](https://neon.tech)

---

## 🛠️ Passo a Passo

### 1️⃣ Instalar Dependências

```bash
# Instalar Prisma e cliente
npm install prisma @prisma/client

# Instalar bcryptjs para hash de senhas
npm install bcryptjs
npm install -D @types/bcryptjs

# Instalar ts-node para executar seed
npm install -D ts-node
```

---

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/world_autistic?schema=public"

# Cloudinary (já existente no projeto)
CLOUDINARY_CLOUD_NAME="dghzftqkj"
CLOUDINARY_API_KEY="669128232276245"
CLOUDINARY_API_SECRET="BALTsh-YCMYDEmfvaaOLeRAAVbE"

# NextAuth (para futuro)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui-gerar-com-openssl"
```

#### Opções de Database URL:

**PostgreSQL Local:**
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/world_autistic"
```

**Supabase (FREE):**
```env
DATABASE_URL="postgresql://postgres:[SEU-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres"
```

**Neon (FREE):**
```env
DATABASE_URL="postgresql://[usuario]:[senha]@[host]/world_autistic?sslmode=require"
```

---

### 3️⃣ Inicializar Prisma (já feito)

O schema já está criado em `prisma/schema.prisma`, mas caso precise reinicializar:

```bash
npx prisma init
```

---

### 4️⃣ Criar e Aplicar Migrations

```bash
# Criar e aplicar a primeira migration
npx prisma migrate dev --name init

# Isto irá:
# - Criar as tabelas no banco de dados
# - Gerar o Prisma Client
```

---

### 5️⃣ Configurar Script de Seed

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

### 6️⃣ Executar Seed

```bash
# Popular o banco de dados com dados de exemplo
npm run prisma:seed

# OU
npx prisma db seed
```

Isto irá criar:
- ✅ 2 usuários (admin, user)
- ✅ 3 conquistas
- ✅ 6 cards de animais
- ✅ 4 cards de cores
- ✅ 3 atividades
- ✅ 1 jogo
- ✅ 2 categorias de frequências
- ✅ 1 rotina
- ✅ Progresso de exemplo
- ✅ Configurações do sistema

**Credenciais de Login:**
- Admin: `admin@worldautistic.com` / `admin123`
- User: `user@example.com` / `user123`

---

### 7️⃣ Visualizar Banco de Dados (Opcional)

```bash
# Abrir Prisma Studio (UI visual para o banco)
npm run prisma:studio
```

Acesse: `http://localhost:5555`

---

## 🔧 Configurar Prisma Client no Next.js

Crie o arquivo `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

---

## 📝 Exemplos de Uso nas API Routes

### Exemplo: `/app/api/cards/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  try {
    const cards = await prisma.card.findMany({
      where: category ? { category: category.toUpperCase() } : {},
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Erro ao buscar cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
```

### Exemplo: `/app/api/users/[id]/progress/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const progress = await prisma.activityProgress.findMany({
      where: { userId: params.id },
      include: {
        activity: true,
      },
      orderBy: { lastAttemptAt: 'desc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
```

---

## 🔄 Comandos Úteis

```bash
# Gerar Prisma Client após mudanças no schema
npx prisma generate

# Criar nova migration após mudanças no schema
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Aplicar migrations em produção
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Formatar schema
npx prisma format

# Validar schema
npx prisma validate
```

---

## 🌐 Deploy (Produção)

### Vercel

1. Configure a variável `DATABASE_URL` no dashboard da Vercel
2. Adicione script de build no `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Railway / Render

Similar ao Vercel, configure a variável de ambiente e o script de build.

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Confirme a DATABASE_URL no `.env`
- Para Supabase/Neon, verifique se o IP está whitelisted

### Erro: "Module not found: Can't resolve '@prisma/client'"
```bash
npx prisma generate
```

### Erro no Seed
```bash
# Executar manualmente
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

---

## ✅ Checklist Final

- [ ] PostgreSQL instalado/configurado
- [ ] `.env` criado com DATABASE_URL
- [ ] `npx prisma migrate dev --name init` executado
- [ ] `npx prisma db seed` executado com sucesso
- [ ] Prisma Studio acessível em localhost:5555
- [ ] `lib/prisma.ts` criado
- [ ] Testado uma API route com Prisma

---

## 📚 Próximos Passos

1. Migrar dados dos arquivos JSON para o banco
2. Implementar autenticação com NextAuth.js
3. Criar API routes para CRUD de todos os modelos
4. Implementar painel administrativo funcional
5. Adicionar validação de dados com Zod
6. Implementar sistema de cache com Redis (opcional)

---

**Dúvidas?** Consulte a [documentação oficial do Prisma](https://www.prisma.io/docs)
