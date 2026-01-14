import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/auth';
import { getAccessTokenFromRequest } from '@/app/lib/cookies';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Helper para verificar admin
async function checkAdmin(request: NextRequest) {
    const token = getAccessTokenFromRequest(request);
    if (!token) return false;
    const payload = await verifyAccessToken(token);
    return payload?.role === 'ADMIN';
}

export async function POST(request: NextRequest) {
    console.log('📥 POST /api/upload chamado');
    if (!(await checkAdmin(request))) {
        console.log('⛔ Admin check falhou');
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Criar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.name.split('.').pop();
        const filename = `${file.name.split('.')[0]}-${uniqueSuffix}.${extension}`;

        // Definir diretório de upload (public/uploads/[folder])
        const uploadDir = join(process.cwd(), 'public', 'uploads', folder);

        // Garantir que diretório existe
        await mkdir(uploadDir, { recursive: true });

        // Caminho completo
        const filepath = join(uploadDir, filename);

        // Salvar arquivo
        await writeFile(filepath, buffer);

        // Retornar URL pública
        const publicUrl = `/uploads/${folder}/${filename}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
    }
}
