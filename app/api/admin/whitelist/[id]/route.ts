
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = getAccessTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const { id } = await params;

        await (prisma as any).whitelist.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Removido com sucesso' });

    } catch (error) {
        console.error('Erro ao remover da whitelist:', error);
        return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
    }
}
