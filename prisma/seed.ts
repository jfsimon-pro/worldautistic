import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // ============================================
    // 👤 USUÁRIOS
    // ============================================
    console.log('👤 Criando usuários...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@worldautistic.com' },
        update: {},
        create: {
            email: 'admin@worldautistic.com',
            passwordHash: adminPassword,
            name: 'Jaime Simon',
            role: 'ADMIN',
            language: 'pt',
        },
    });

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            passwordHash: userPassword,
            name: 'Maria Silva',
            role: 'USER',
            dateOfBirth: new Date('2018-05-15'),
            language: 'pt',
        },
    });

    console.log(`✅ Criados: Admin (${admin.email}), User (${user.email})`);

    // ============================================
    // 🎯 CONQUISTAS
    // ============================================
    console.log('🎯 Criando conquistas...');

    const achievements = await Promise.all([
        prisma.achievement.upsert({
            where: { id: 'achievement-first-activity' },
            update: {},
            create: {
                id: 'achievement-first-activity',
                name: 'Primeira Atividade',
                nameEn: 'First Activity',
                nameEs: 'Primera Actividad',
                description: 'Complete sua primeira atividade',
                descriptionEn: 'Complete your first activity',
                descriptionEs: 'Completa tu primera actividad',
                icon: '🎉',
                type: 'ACTIVITY_COMPLETION',
                criteria: { activitiesCompleted: 1 },
                points: 10,
            },
        }),
        prisma.achievement.upsert({
            where: { id: 'achievement-week-streak' },
            update: {},
            create: {
                id: 'achievement-week-streak',
                name: 'Uma Semana Ativo',
                nameEn: 'One Week Streak',
                nameEs: 'Una Semana Activo',
                description: 'Use o app por 7 dias consecutivos',
                descriptionEn: 'Use the app for 7 consecutive days',
                descriptionEs: 'Usa la app durante 7 días consecutivos',
                icon: '🔥',
                type: 'STREAK',
                criteria: { streakDays: 7 },
                points: 50,
            },
        }),
        prisma.achievement.upsert({
            where: { id: 'achievement-perfect-score' },
            update: {},
            create: {
                id: 'achievement-perfect-score',
                name: 'Pontuação Perfeita',
                nameEn: 'Perfect Score',
                nameEs: 'Puntuación Perfecta',
                description: 'Acerte todas as questões de uma atividade',
                descriptionEn: 'Get all questions right in an activity',
                descriptionEs: 'Acierta todas las preguntas de una actividad',
                icon: '⭐',
                type: 'PERFECT_SCORE',
                criteria: { score: 100 },
                points: 25,
            },
        }),
    ]);

    console.log(`✅ ${achievements.length} conquistas criadas`);

    // ============================================
    // 📚 CARDS INTERATIVOS - ANIMAIS
    // ============================================
    console.log('🐾 Criando cards de animais...');

    const animals = [
        { id: 'cat', pt: 'Gato', en: 'Cat', es: 'Gato', color: '#AAD3E9', border: '#56A9D4' },
        { id: 'dog', pt: 'Cachorro', en: 'Dog', es: 'Perro', color: '#F98EB0', border: '#F6467f' },
        { id: 'elephant', pt: 'Elefante', en: 'Elephant', es: 'Elefante', color: '#8ECF99', border: '#4E9F62' },
        { id: 'lion', pt: 'Leão', en: 'Lion', es: 'León', color: '#E07A5F', border: '#9D3C27' },
        { id: 'giraffe', pt: 'Girafa', en: 'Giraffe', es: 'Jirafa', color: '#6A4C93', border: '#432C64' },
        { id: 'penguin', pt: 'Pinguim', en: 'Penguin', es: 'Pingüino', color: '#D9F99D', border: '#A3E635' },
    ];

    for (const animal of animals) {
        await prisma.card.upsert({
            where: { identifier: animal.id },
            update: {},
            create: {
                category: 'ANIMALS',
                identifier: animal.id,
                namePt: animal.pt,
                nameEn: animal.en,
                nameEs: animal.es,
                imageUrl: `/images/animals/${animal.id}.png`,
                audioPt: `/audio/pt/animals/${animal.en}_.mp3`,
                audioEn: `/audio/en/animals/${animal.en}_.mp3`,
                audioEs: `/audio/es/animals/${animal.es}_.mp3`,
                color: animal.color,
                borderColor: animal.border,
                textColor: '#333333',
            },
        });
    }

    console.log(`✅ ${animals.length} cards de animais criados`);

    // ============================================
    // 📚 CARDS INTERATIVOS - CORES
    // ============================================
    console.log('🎨 Criando cards de cores...');

    const colors = [
        { id: 'red', pt: 'Vermelho', en: 'Red', es: 'Rojo', color: '#FF0000', border: '#CC0000' },
        { id: 'blue', pt: 'Azul', en: 'Blue', es: 'Azul', color: '#0000FF', border: '#0000CC' },
        { id: 'green', pt: 'Verde', en: 'Green', es: 'Verde', color: '#00FF00', border: '#00CC00' },
        { id: 'yellow', pt: 'Amarelo', en: 'Yellow', es: 'Amarillo', color: '#FFFF00', border: '#CCCC00' },
    ];

    for (const color of colors) {
        await prisma.card.upsert({
            where: { identifier: color.id },
            update: {},
            create: {
                category: 'COLORS',
                identifier: color.id,
                namePt: color.pt,
                nameEn: color.en,
                nameEs: color.es,
                imageUrl: `/images/colors/${color.id}.png`,
                audioPt: `/audio/pt/colors/${color.en}_.mp3`,
                color: color.color,
                borderColor: color.border,
                textColor: '#FFFFFF',
            },
        });
    }

    console.log(`✅ ${colors.length} cards de cores criados`);

    // ============================================
    // ✏️ ATIVIDADES
    // ============================================
    console.log('✏️ Criando atividades...');

    const activities = await Promise.all([
        prisma.activity.upsert({
            where: { id: 'math01-level1' },
            update: {},
            create: {
                id: 'math01-level1',
                type: 'MATH_ADDITION',
                level: 'LEVEL_1',
                componentName: 'MATH01',
                title: 'Adição Básica - Nível 1',
                titleEn: 'Basic Addition - Level 1',
                titleEs: 'Adición Básica - Nivel 1',
                description: 'Pratique adição com números de 1 a 10',
                maxAttempts: 5,
                estimatedTime: 180,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'math02-level1' },
            update: {},
            create: {
                id: 'math02-level1',
                type: 'MATH_SUBTRACTION',
                level: 'LEVEL_1',
                componentName: 'MATH02',
                title: 'Subtração Básica - Nível 1',
                titleEn: 'Basic Subtraction - Level 1',
                titleEs: 'Sustracción Básica - Nivel 1',
                description: 'Pratique subtração com números de 1 a 10',
                maxAttempts: 5,
                estimatedTime: 180,
            },
        }),
        prisma.activity.upsert({
            where: { id: 'lang01-level1' },
            update: {},
            create: {
                id: 'lang01-level1',
                type: 'LANG_LETTER_RECOGNITION',
                level: 'LEVEL_1',
                componentName: 'LANG01',
                title: 'Reconhecimento de Letras',
                titleEn: 'Letter Recognition',
                titleEs: 'Reconocimiento de Letras',
                description: 'Aprenda a reconhecer as letras do alfabeto',
                maxAttempts: 5,
                estimatedTime: 120,
            },
        }),
    ]);

    console.log(`✅ ${activities.length} atividades criadas`);

    // ============================================
    // 🎮 JOGOS
    // ============================================
    console.log('🎮 Criando jogos...');

    const memoryGame = await prisma.game.upsert({
        where: { id: 'memory-game-1' },
        update: {},
        create: {
            id: 'memory-game-1',
            name: 'Jogo da Memória',
            nameEn: 'Memory Game',
            nameEs: 'Juego de Memoria',
            type: 'MEMORY_GAME',
            description: 'Encontre os pares de cartas',
            descriptionEn: 'Find the matching pairs',
            descriptionEs: 'Encuentra los pares',
            imageUrl: '/images/games/memory-game.png',
            minAge: 3,
            maxDuration: 300,
            config: {
                gridSize: '4x4',
                theme: 'animals',
            },
        },
    });

    console.log(`✅ Jogo criado: ${memoryGame.name}`);

    // ============================================
    // 🎵 FREQUÊNCIAS SONORAS
    // ============================================
    console.log('🎵 Criando categorias de frequências...');

    await prisma.frequencyCategory.upsert({
        where: { id: 'freq-cat-relax' },
        update: {},
        create: {
            id: 'freq-cat-relax',
            name: 'Relaxamento',
            nameEn: 'Relaxation',
            nameEs: 'Relajación',
            description: 'Frequências para relaxamento e meditação',
            assetFolder: 'relaxamento',
            icon: '🧘',
        },
    });

    await prisma.frequencyCategory.upsert({
        where: { id: 'freq-cat-focus' },
        update: {},
        create: {
            id: 'freq-cat-focus',
            name: 'Foco',
            nameEn: 'Focus',
            nameEs: 'Enfoque',
            description: 'Frequências para concentração',
            assetFolder: 'foco',
            icon: '🎯',
        },
    });

    console.log(`✅ Categorias de frequências criadas`);

    // ============================================
    // 📖 HISTÓRIAS E ROTINAS
    // ============================================
    console.log('📖 Criando histórias e rotinas...');

    await prisma.story.upsert({
        where: { id: 'routine-morning' },
        update: {},
        create: {
            id: 'routine-morning',
            type: 'ROUTINE',
            title: 'Rotina Matinal',
            titleEn: 'Morning Routine',
            titleEs: 'Rutina Matutina',
            content: `
# Rotina Matinal

1. 🌅 Acordar
2. 🦷 Escovar os dentes
3. 🚿 Tomar banho
4. 👕 Vestir-se
5. 🥐 Tomar café da manhã
6. 🎒 Pegar a mochila
7. 🚌 Ir para a escola
      `,
            coverImage: '/images/routines/morning.png',
            targetAge: '3-10',
            tags: ['rotina', 'manhã', 'escola'],
            publishedAt: new Date(),
        },
    });

    console.log(`✅ Histórias e rotinas criadas`);

    // ============================================
    // 📊 PROGRESSO DE EXEMPLO
    // ============================================
    console.log('📊 Criando progresso de exemplo...');

    await prisma.activityProgress.create({
        data: {
            userId: user.id,
            activityId: 'math01-level1',
            attempts: 1,
            correctAnswers: 4,
            incorrectAnswers: 1,
            score: 80,
            completionTime: 120,
            isCompleted: true,
            completedAt: new Date(),
        },
    });

    await prisma.userStreak.create({
        data: {
            userId: user.id,
            currentStreak: 3,
            longestStreak: 5,
            lastActiveDate: new Date(),
        },
    });

    console.log(`✅ Progresso de exemplo criado`);

    // ============================================
    // ⚙️ CONFIGURAÇÕES DO SISTEMA
    // ============================================
    console.log('⚙️ Criando configurações do sistema...');

    await prisma.appSettings.upsert({
        where: { key: 'app.version' },
        update: {},
        create: {
            key: 'app.version',
            value: '1.0.0',
            description: 'Versão atual da aplicação',
        },
    });

    await prisma.appSettings.upsert({
        where: { key: 'cloudinary.cloudName' },
        update: {},
        create: {
            key: 'cloudinary.cloudName',
            value: 'dghzftqkj',
            description: 'Nome do cloud Cloudinary',
        },
    });

    console.log(`✅ Configurações criadas`);

    console.log('\n✅ Seed concluído com sucesso! 🎉\n');
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
