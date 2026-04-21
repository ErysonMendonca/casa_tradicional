/**
 * Supabase Client — lado do browser (Client Components)
 * Usa createBrowserClient do @supabase/ssr para suporte a cookies (auth).
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
