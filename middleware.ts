import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './app/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const protectedPaths = ['/home', '/activities', '/animals', '/colors', '/food', '/objects', '/commands', '/games', '/memoryGame', '/settings', '/activity'];
    const adminPaths = ['/admin'];

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

    // Rotas públicas
    if (!isProtected && !isAdminPath) {
        return NextResponse.next();
    }

    // Pegar access token do cookie
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/signIn';
        return NextResponse.redirect(url);
    }

    // Verificar token
    const payload = await verifyAccessToken(token);

    if (!payload) {
        const url = request.nextUrl.clone();
        url.pathname = '/signIn';
        return NextResponse.redirect(url);
    }

    // Verificar se é rota admin e se o usuário é admin
    if (isAdminPath && payload.role !== 'ADMIN') {
        console.log('❌ [MIDDLEWARE] Usuário não é ADMIN, bloqueando acesso a', pathname);
        const url = request.nextUrl.clone();
        url.pathname = '/home';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/home/:path*',
        '/activities/:path*',
        '/animals/:path*',
        '/colors/:path*',
        '/food/:path*',
        '/objects/:path*',
        '/commands/:path*',
        '/games/:path*',
        '/memoryGame/:path*',
        '/settings/:path*',
        '/activity/:path*',
        '/admin/:path*',
    ],
};
