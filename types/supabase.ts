export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      products: {
        Row: {
          alt: string | null
          badge: string | null
          category: string | null
          created_at: string
          description: string | null
          details: string | null
          display: boolean | null
          features: Json | null
          id: number
          image_url: string | null
          max_bore_size_inch: string | null
          max_bore_size_mm: number | null
          name: string
          price: number | null
          price_tiers: Json | null
          slug: string | null
          specs: Json | null
          summary: string | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          alt?: string | null
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          display?: boolean | null
          features?: Json | null
          id?: number
          image_url?: string | null
          max_bore_size_inch?: string | null
          max_bore_size_mm?: number | null
          name?: string
          price?: number | null
          price_tiers?: Json | null
          slug?: string | null
          specs?: Json | null
          summary?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          alt?: string | null
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          display?: boolean | null
          features?: Json | null
          id?: number
          image_url?: string | null
          max_bore_size_inch?: string | null
          max_bore_size_mm?: number | null
          name?: string
          price?: number | null
          price_tiers?: Json | null
          slug?: string | null
          specs?: Json | null
          summary?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products_backup_20260613: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number | null
          image_url: string | null
          max_bore_size_inch: string | null
          max_bore_size_mm: number | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          image_url?: string | null
          max_bore_size_inch?: string | null
          max_bore_size_mm?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          image_url?: string | null
          max_bore_size_inch?: string | null
          max_bore_size_mm?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          address: string | null
          cable_length: string | null
          created_at: string
          decided_at: string | null
          displacement: string | null
          email: string
          engine: string | null
          id: string
          line_items: Json
          locking_system: string | null
          max_hull_speed: string | null
          name: string
          notes: string | null
          num_blades: string | null
          num_propellers: string | null
          phone: string | null
          phone_region: string | null
          prop_diameter: string | null
          prop_type: string | null
          quote_notes: string | null
          quoted_at: string | null
          quoted_price: number | null
          sent_at: string | null
          sent_html: string | null
          sent_line_items: Json | null
          sent_quote_notes: string | null
          sent_quoted_price: number | null
          shaft_diameter: string | null
          status: string
          transmission: string | null
          updated_at: string
          yacht_name: string | null
          yacht_type: string | null
        }
        Insert: {
          address?: string | null
          cable_length?: string | null
          created_at?: string
          decided_at?: string | null
          displacement?: string | null
          email: string
          engine?: string | null
          id?: string
          line_items?: Json
          locking_system?: string | null
          max_hull_speed?: string | null
          name: string
          notes?: string | null
          num_blades?: string | null
          num_propellers?: string | null
          phone?: string | null
          phone_region?: string | null
          prop_diameter?: string | null
          prop_type?: string | null
          quote_notes?: string | null
          quoted_at?: string | null
          quoted_price?: number | null
          sent_at?: string | null
          sent_html?: string | null
          sent_line_items?: Json | null
          sent_quote_notes?: string | null
          sent_quoted_price?: number | null
          shaft_diameter?: string | null
          status?: string
          transmission?: string | null
          updated_at?: string
          yacht_name?: string | null
          yacht_type?: string | null
        }
        Update: {
          address?: string | null
          cable_length?: string | null
          created_at?: string
          decided_at?: string | null
          displacement?: string | null
          email?: string
          engine?: string | null
          id?: string
          line_items?: Json
          locking_system?: string | null
          max_hull_speed?: string | null
          name?: string
          notes?: string | null
          num_blades?: string | null
          num_propellers?: string | null
          phone?: string | null
          phone_region?: string | null
          prop_diameter?: string | null
          prop_type?: string | null
          quote_notes?: string | null
          quoted_at?: string | null
          quoted_price?: number | null
          sent_at?: string | null
          sent_html?: string | null
          sent_line_items?: Json | null
          sent_quote_notes?: string | null
          sent_quoted_price?: number | null
          shaft_diameter?: string | null
          status?: string
          transmission?: string | null
          updated_at?: string
          yacht_name?: string | null
          yacht_type?: string | null
        }
        Relationships: []
      }
      yachts: {
        Row: {
          blades: string | null
          created_at: string
          diameter: number | null
          id: number
          length: number | null
          name: string | null
          pitch: string | null
          propeller: string | null
          shaft: string | null
          transmission: string | null
        }
        Insert: {
          blades?: string | null
          created_at?: string
          diameter?: number | null
          id?: number
          length?: number | null
          name?: string | null
          pitch?: string | null
          propeller?: string | null
          shaft?: string | null
          transmission?: string | null
        }
        Update: {
          blades?: string | null
          created_at?: string
          diameter?: number | null
          id?: number
          length?: number | null
          name?: string | null
          pitch?: string | null
          propeller?: string | null
          shaft?: string | null
          transmission?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
