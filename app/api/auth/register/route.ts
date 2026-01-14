import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiration } from '@/app/lib/auth';
import { setAuthCookies } from '@/app/lib/cookies';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validações básicas
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar se o email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 400 }
            );
        }

        // Hash da senha
        const passwordHash = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: 'USER',
                language: 'pt',
            },
        });

        // Criar streak inicial
        await prisma.userStreak.create({
            data: {
                userId: user.id,
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: new Date(),
            },
        });

        // Gerar tokens JWT
        const accessToken = await generateAccessToken(user.id, user.role);
        const refreshToken = await generateRefreshToken(user.id);

        // Salvar refresh token no banco
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiration(),
            },
        });

        // Criar response com cookies
        const response = NextResponse.json({
            message: 'Conta criada com sucesso!',
        }, { status: 201 });

        return setAuthCookies(response, accessToken, refreshToken);
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        return NextResponse.json(
            { error: 'Erro ao criar conta. Tente novamente.' },
            { status: 500 }
        );
    }
}
