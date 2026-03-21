
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number
          interests: string[]
          created_at: string
          bio: string
          looking_for: string
          id: string
          location: string
          name: string
          whatsapp: string
        }
        Insert: {
          age: number
          interests?: string[]
          created_at?: string
          bio: string
          looking_for: string
          id?: string
          location: string
          name: string
          whatsapp: string
        }
        Update: {
          age?: number
          interests?: string[]
          created_at?: string
          bio?: string
          looking_for?: string
          id?: string
          location?: string
          name?: string
          whatsapp?: string
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
