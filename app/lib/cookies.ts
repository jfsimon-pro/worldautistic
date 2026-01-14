import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
): NextResponse {
    // Access Token (15 min)
    response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutos em segundos
        path: '/',
    });

    // Refresh Token (7 dias)
    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
        path: '/',
    });

    return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
}

export function getAccessTokenFromRequest(request: NextRequest): string | null {
    return request.cookies.get('accessToken')?.value || null;
}

export function getRefreshTokenFromRequest(request: NextRequest): string | null {
    return request.cookies.get('refreshToken')?.value || null;
}
