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
      orders: {
        Row: {
          id: string
          email: string
          customer_name: string
          total_price: number
          status: string
          shopify_order_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          customer_name: string
          total_price: number
          status?: string
          shopify_order_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          customer_name?: string
          total_price?: number
          status?: string
          shopify_order_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          handle: string
          description: string
          shopify_product_id: string
          shopify_variant_id: string
          inventory_item_id: string
          price: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          handle: string
          description?: string
          shopify_product_id: string
          shopify_variant_id?: string
          inventory_item_id?: string
          price: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          handle?: string
          description?: string
          shopify_product_id?: string
          shopify_variant_id?: string
          inventory_item_id?: string
          price?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          inventory_item_id: string
          quantity: number
          alert_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inventory_item_id: string
          quantity: number
          alert_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inventory_item_id?: string
          quantity?: number
          alert_threshold?: number
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          email: string
          name: string
          shopify_customer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          shopify_customer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          shopify_customer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      abandoned_carts: {
        Row: {
          id: string
          email: string
          customer_name: string
          total_value: number
          items: Json
          status: string
          recovery_emails_sent: number
          last_recovery_email: string | null
          recovered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          customer_name: string
          total_value: number
          items: Json
          status?: string
          recovery_emails_sent?: number
          last_recovery_email?: string | null
          recovered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          customer_name?: string
          total_value?: number
          items?: Json
          status?: string
          recovery_emails_sent?: number
          last_recovery_email?: string | null
          recovered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
