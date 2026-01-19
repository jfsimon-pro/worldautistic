
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

// GET: Listar whitelist
export async function GET(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const whitelist = await (prisma as any).whitelist.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ whitelist });

    } catch (error) {
        console.error('Erro ao buscar whitelist:', error);
        return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
    }
}

// POST: Adicionar email à whitelist
export async function POST(request: NextRequest) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const body = await request.json();
        const { email, note } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const alreadyExists = await (prisma as any).whitelist.findUnique({
            where: { email: normalizedEmail }
        });

        if (alreadyExists) {
            return NextResponse.json({ error: 'Email já está na whitelist' }, { status: 400 });
        }

        const newEntry = await (prisma as any).whitelist.create({
            data: {
                email: normalizedEmail,
                note
            }
        });

        return NextResponse.json(newEntry);

    } catch (error) {
        console.error('Erro ao adicionar à whitelist:', error);
        return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }
}
