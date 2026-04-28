import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
 
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('restaurant_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    
    // Retorna o primeiro item ou null se vazio
    return NextResponse.json(data && data.length > 0 ? data[0] : null);
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
      about_title: body.about_title,
      about_text: body.about_text,
      contact_phone: body.contact_phone,
      contact_phone_2: body.contact_phone_2,
      contact_email: body.contact_email,
      contact_address: body.contact_address,
      footer_about_text: body.footer_about_text,
      footer_rights: body.footer_rights,
      updated_at: new Date().toISOString(),
    };

    // Tenta encontrar a configuração mais recente
    const { data: existing } = await supabaseAdmin
      .from('restaurant_settings')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1);

    let data, error;

    if (existing && existing.length > 0) {
      // Atualiza a linha existente
      const result = await supabaseAdmin
        .from('restaurant_settings')
        .update(payload)
        .eq('id', existing[0].id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Cria a primeira linha
      const result = await supabaseAdmin
        .from('restaurant_settings')
        .insert(payload)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Erro detalhado do Supabase:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('Erro ao salvar configurações:', err);
    return NextResponse.json({ error: err.message || 'Erro ao salvar configurações.' }, { status: 500 });
  }
}
