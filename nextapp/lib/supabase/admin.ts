/**
 * Supabase Admin Client — lado do servidor apenas (API Routes / Server Actions)
 * USA a service_role key — NUNCA expor no cliente.
 * Nota: sem generic de Database para evitar erros de tipo quando
 * as env vars não estão configuradas em tempo de build.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-key';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = createClient<any>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
