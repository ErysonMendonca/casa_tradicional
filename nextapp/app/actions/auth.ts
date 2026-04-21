'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Função para iniciar um client nativo usando as chaves públicas (Anon Key)
// Next.js 15+ cookies() é assíncrono!
async function createActionClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

export async function loginCustom(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Preencha todos os campos.' };
    }

    // Instancia o cliente com a Anon Key que o usuário configurou
    const supabase = await createActionClient();

    // Chama a função RPC segura criada no banco de dados (que usa SECURITY DEFINER)
    const { data: sessionId, error } = await supabase.rpc('login_admin', {
      p_email: email,
      p_password: password,
    });

    if (error || !sessionId) {
      console.error('Erro de login auth:', error?.message || 'Credenciais inválidas.');
      return { error: 'E-mail ou senha incorretos.' };
    }

    // 7 dias de expiração
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Armazena no cookie (Next.js 15+)
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires,
      path: '/',
    });

    return { success: true };
  } catch (err: any) {
    console.error('Erro fatal no loginCustom:', err);
    return { error: `Erro interno no servidor: ${err.message}` };
  }
}

export async function logoutCustom() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('admin_session')?.value;
  
  if (sessionId) {
    const supabase = await createActionClient();
    // Remove sessão do DB
    await supabase.from('sessions').delete().eq('id', sessionId);
  }

  cookieStore.delete('admin_session');
}
