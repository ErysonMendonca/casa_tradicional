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
      restaurant_settings: {
        Row: {
          id: string;
          total_tables: number;
          open_time: string;
          close_time: string;
          reservation_duration_mins: number;
          whatsapp_number: string;
          about_title: string;
          about_text: string;
          contact_phone: string;
          contact_phone_2: string;
          contact_email: string;
          contact_address: string;
          footer_about_text: string;
          footer_rights: string;
          hero_title: string;
          hero_image: string;
          highlight1_title: string;
          highlight1_image: string;
          highlight1_desc: string;
          highlight2_title: string;
          highlight2_image: string;
          highlight2_desc: string;
          highlight3_title: string;
          highlight3_image: string;
          highlight3_desc: string;
          about_image: string;
          booking_title: string;
          booking_desc: string;
          location_desc: string;
          location_map_iframe: string;
          color_primary: string;
          color_secondary: string;
          color_tertiary: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          total_tables?: number;
          open_time?: string;
          close_time?: string;
          reservation_duration_mins?: number;
          whatsapp_number?: string;
          about_title?: string;
          about_text?: string;
          contact_phone?: string;
          contact_phone_2?: string;
          contact_email?: string;
          contact_address?: string;
          footer_about_text?: string;
          footer_rights?: string;
          hero_title?: string;
          hero_image?: string;
          highlight1_title?: string;
          highlight1_image?: string;
          highlight1_desc?: string;
          highlight2_title?: string;
          highlight2_image?: string;
          highlight2_desc?: string;
          highlight3_title?: string;
          highlight3_image?: string;
          highlight3_desc?: string;
          about_image?: string;
          booking_title?: string;
          booking_desc?: string;
          location_desc?: string;
          location_map_iframe?: string;
          color_primary?: string;
          color_secondary?: string;
          color_tertiary?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          total_tables?: number;
          open_time?: string;
          close_time?: string;
          reservation_duration_mins?: number;
          whatsapp_number?: string;
          about_title?: string;
          about_text?: string;
          contact_phone?: string;
          contact_phone_2?: string;
          contact_email?: string;
          contact_address?: string;
          footer_about_text?: string;
          footer_rights?: string;
          hero_title?: string;
          hero_image?: string;
          highlight1_title?: string;
          highlight1_image?: string;
          highlight1_desc?: string;
          highlight2_title?: string;
          highlight2_image?: string;
          highlight2_desc?: string;
          highlight3_title?: string;
          highlight3_image?: string;
          highlight3_desc?: string;
          about_image?: string;
          booking_title?: string;
          booking_desc?: string;
          location_desc?: string;
          location_map_iframe?: string;
          color_primary?: string;
          color_secondary?: string;
          color_tertiary?: string;
          updated_at?: string;
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
export type RestaurantSettings = Database['public']['Tables']['restaurant_settings']['Row'];
