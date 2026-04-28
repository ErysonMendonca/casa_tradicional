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
      hero_title: body.hero_title,
      hero_image: body.hero_image,
      highlight1_title: body.highlight1_title,
      highlight1_image: body.highlight1_image,
      highlight1_desc: body.highlight1_desc,
      highlight2_title: body.highlight2_title,
      highlight2_image: body.highlight2_image,
      highlight2_desc: body.highlight2_desc,
      highlight3_title: body.highlight3_title,
      highlight3_image: body.highlight3_image,
      highlight3_desc: body.highlight3_desc,
      about_image: body.about_image,
      booking_title: body.booking_title,
      booking_desc: body.booking_desc,
      location_desc: body.location_desc,
      location_map_iframe: body.location_map_iframe,
      color_primary: body.color_primary || '#7E1C1C',
      color_secondary: body.color_secondary || '#371D10',
      color_tertiary: body.color_tertiary || '#F4EFE6',
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
