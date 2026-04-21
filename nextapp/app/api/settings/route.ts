import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('restaurant_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(null);
      }
      throw error;
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao buscar configurações:', err);
    return NextResponse.json({ error: 'Erro ao buscar configurações.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      total_tables: Number(body.total_tables),
      open_time: body.open_time,
      close_time: body.close_time,
      reservation_duration_mins: Number(body.reservation_duration_mins),
      whatsapp_number: body.whatsapp_number || '',
      updated_at: new Date().toISOString(),
    };

    // Pega o ID da única linha (assumindo que existe 1)
    const { data: existing } = await supabaseAdmin
      .from('restaurant_settings')
      .select('id')
      .limit(1)
      .single();

    let data, error;

    if (existing) {
      const result = await supabaseAdmin
        .from('restaurant_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabaseAdmin
        .from('restaurant_settings')
        .insert(payload)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Erro ao salvar configurações:', err);
    return NextResponse.json({ error: 'Erro ao salvar configurações.' }, { status: 500 });
  }
}
