import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao atualizar reserva:', err);
    return NextResponse.json({ error: 'Erro ao atualizar reserva.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir reserva:', err);
    return NextResponse.json({ error: 'Erro ao excluir reserva.' }, { status: 500 });
  }
}
