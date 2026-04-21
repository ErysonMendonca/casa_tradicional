import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        date: body.date,
        time: body.time,
        guests: Number(body.guests),
        notes: body.notes ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    return NextResponse.json({ error: 'Erro ao processar reserva.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar reservas.' }, { status: 500 });
  }
}
