import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DEFAULT_PRODUCTS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  try {
    let query = supabaseAdmin.from('products').select('*').eq('active', true).order('name');
    if (categoryId) query = query.eq('category_id', categoryId);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    // Fallback local
    const products = categoryId
      ? DEFAULT_PRODUCTS.filter(p => p.category_id === categoryId)
      : DEFAULT_PRODUCTS;
    return NextResponse.json(products);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        category_id: body.category_id,
        name: body.name,
        price: body.price,
        image: body.image,
        description: body.description,
        ingredients: body.ingredients,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
