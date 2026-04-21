/**
 * Database Types — gerados a partir do schema do Supabase.
 * Quando conectar o Supabase, rode:
 *   npx supabase gen types typescript --project-id SEU_PROJECT_ID > lib/supabase/types.ts
 * para substituir este arquivo por tipos reais.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          thumbnail: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          thumbnail: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          thumbnail?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          price: number;
          image: string;
          description: string;
          ingredients: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          price: number;
          image: string;
          description: string;
          ingredients: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          price?: number;
          image?: string;
          description?: string;
          ingredients?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          date?: string;
          time?: string;
          guests?: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Tipos de conveniência
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];
