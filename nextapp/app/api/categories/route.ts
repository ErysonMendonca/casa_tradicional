import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DEFAULT_CATEGORIES } from '@/lib/data';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    // Fallback local quando o Supabase não está configurado
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name: body.name, thumbnail: body.thumbnail })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
