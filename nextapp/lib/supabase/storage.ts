import { supabase } from './client';

/**
 * Faz upload de um arquivo para o bucket 'images' do Supabase Storage.
 * @param file O arquivo a ser enviado.
 * @param folder Pasta dentro do bucket (ex: 'products' ou 'categories').
 * @returns A URL pública do arquivo enviado.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Erro no upload:', uploadError);
    throw new Error('Falha ao enviar o arquivo.');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}
