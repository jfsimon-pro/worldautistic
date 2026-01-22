import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './app/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const protectedPaths = ['/home', '/activities', '/animals', '/colors', '/food', '/objects', '/commands', '/games', '/memoryGame', '/settings', '/activity'];
    const adminPaths = ['/admin'];

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

    // Rotas de autenticação que devem redirecionar se o usuário já estiver logado
    const authPaths = ['/', '/signIn', '/register'];
    const isAuthPath = authPaths.some(path => pathname === path);

    // Se não é protegida, nem admin, nem auth path, deixa passar
    if (!isProtected && !isAdminPath && !isAuthPath) {
        return NextResponse.next();
    }

    // Pegar access token do cookie
    const token = request.cookies.get('accessToken')?.value;

    // Se for rota pública de auth (login/home page)
    if (isAuthPath) {
        // Se não tem token, deixa entrar na página de login
        if (!token) {
            return NextResponse.next();
        }

        // Se tem token, verifica se é válido
        const payload = await verifyAccessToken(token);

        // Se token inválido, deixa entrar (vai provavelmente falhar depois ou limpar o cookie, mas aqui deixa o acesso)
        if (!payload) {
            return NextResponse.next();
        }

        // Se token válido, redireciona para dentro do app
        const url = request.nextUrl.clone();
        if (payload.role === 'ADMIN') {
            url.pathname = '/admin';
        } else {
            url.pathname = '/home';
        }
        return NextResponse.redirect(url);
    }

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
        '/',
        '/signIn',
        '/register',
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
