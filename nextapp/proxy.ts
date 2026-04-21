/**
 * Proxy Next.js (Ex-Middleware) — Proteção das rotas /admin
 * No Next.js 16+, a convenção mudou de middleware.ts para proxy.ts.
 * Redireciona para /admin/login se não houver sessão ativa.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Apenas verificamos se o cookie existe
  const isValidSession = !!request.cookies.get('admin_session')?.value;

  // Não logado
  if (!isValidSession) {
    // Bloquear acesso ao frontend /admin
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Bloquear acesso às APIs (Proteção total do Backend)
    if (path.startsWith('/api/')) {
      // Exceções PÚBLICAS: 
      // 1. Ver cardápio (GET products e categories)
      // 2. Fazer uma requisição de reserva (POST reservations)
      const isPublicGet = method === 'GET' && (path === '/api/products' || path === '/api/categories');
      const isPublicPost = method === 'POST' && path === '/api/reservations';
      
      if (!isPublicGet && !isPublicPost) {
        return NextResponse.json({ error: 'Acesso negado. Faça login.' }, { status: 401 });
      }
    }
  }

  // Já logado e tentando acessar a tela de login -> envia pro painel
  if (isValidSession && path.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
