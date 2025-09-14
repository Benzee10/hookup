
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
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: "purchase" | "unlock" | "admin_grant"
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: "purchase" | "unlock" | "admin_grant"
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: "purchase" | "unlock" | "admin_grant"
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string
          id: string
          proof_url: string
          status: "pending" | "approved" | "rejected"
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          proof_url: string
          status?: "pending" | "approved" | "rejected"
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          proof_url?: string
          status?: "pending" | "approved" | "rejected"
          transaction_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          categories: string[]
          created_at: string
          description: string
          gallery: string[]
          id: string
          location: string
          name: string
          premium_contact: string
          unlock_cost: number
        }
        Insert: {
          age: number
          categories?: string[]
          created_at?: string
          description: string
          gallery?: string[]
          id?: string
          location: string
          name: string
          premium_contact: string
          unlock_cost?: number
        }
        Update: {
          age?: number
          categories?: string[]
          created_at?: string
          description?: string
          gallery?: string[]
          id?: string
          location?: string
          name?: string
          premium_contact?: string
          unlock_cost?: number
        }
        Relationships: []
      }
      unlocks: {
        Row: {
          created_at: string
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          credits: number
          email: string
          id: string
          name: string
          role: "user" | "admin"
        }
        Insert: {
          credits?: number
          email: string
          id: string
          name: string
          role?: "user" | "admin"
        }
        Update: {
          credits?: number
          email?: string
          id?: string
          name?: string
          role?: "user" | "admin"
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
        approve_payment: {
            Args: {
              payment_id_to_approve: string
              credits_to_award: number
            }
            Returns: undefined
        }
        grant_credits: {
            Args: {
              target_user_id: string
              amount_to_grant: number
              admin_description: string
            }
            Returns: undefined
        }
        is_admin: {
            Args: Record<PropertyKey, never>
            Returns: boolean
        }
        unlock_profile: {
            Args: {
              profile_id_to_unlock: string
            }
            Returns: undefined
        }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}