import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

async function checkAdmin(request: NextRequest) {
    const token = getAccessTokenFromRequest(request);
    if (!token) return false;
    const payload = await verifyAccessToken(token);
    return payload?.role === 'ADMIN';
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const card = await prisma.card.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(card);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar card' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.card.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Card excluído com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir card' }, { status: 500 });
    }
}
