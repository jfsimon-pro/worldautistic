import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Mapeamento de extensão para content-type
const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
};

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const filePath = path.join('/');

        // Caminho completo do arquivo
        const fullPath = join(process.cwd(), 'public', 'uploads', filePath);

        // Verificar se arquivo existe
        if (!existsSync(fullPath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Ler o arquivo
        const fileBuffer = await readFile(fullPath);

        // Determinar content-type
        const extension = filePath.split('.').pop()?.toLowerCase() || 'png';
        const contentType = mimeTypes[extension] || 'application/octet-stream';

        // Retornar o arquivo com headers apropriados
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Erro ao servir arquivo:', error);
        return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
    }
}
