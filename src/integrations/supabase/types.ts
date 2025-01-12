export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["client_activity_type"]
          client_id: string
          created_at: string
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["client_activity_type"]
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["client_activity_type"]
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_activities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_deletion_requests: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          requested_by: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          requested_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          requested_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_deletion_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_deletion_requests_requested_by_profiles_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_deletion_requests_reviewed_by_profiles_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string
          content_type: string
          created_at: string
          file_path: string
          filename: string
          id: string
          size: number
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          client_id: string
          content_type: string
          created_at?: string
          file_path: string
          filename: string
          id?: string
          size: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string
          content_type?: string
          created_at?: string
          file_path?: string
          filename?: string
          id?: string
          size?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          city: string | null
          created_at: string
          dob: string | null
          email: string | null
          gender: string | null
          id: string
          income: number | null
          name: string
          note: string | null
          notes: string | null
          phone: string | null
          postcode: string | null
          qualification: string | null
          sexy: string | null
          street: string | null
          suburb: string | null
          test_1: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          income?: number | null
          name: string
          note?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          qualification?: string | null
          sexy?: string | null
          street?: string | null
          suburb?: string | null
          test_1?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          income?: number | null
          name?: string
          note?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          qualification?: string | null
          sexy?: string | null
          street?: string | null
          suburb?: string | null
          test_1?: string | null
          website?: string | null
        }
        Relationships: []
      }
      document_deletion_requests: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          reason: string | null
          requested_by: string
          reviewed_by: string | null
          status: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          reason?: string | null
          requested_by: string
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          reason?: string | null
          requested_by?: string
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_deletion_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_deletion_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "client_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_deletion_requests_requested_by_profiles_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_deletion_requests_reviewed_by_profiles_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          created_at: string
          field_id: string
          id: string
          label: string
          options: string[] | null
          order_index: number
          required: boolean | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_id: string
          id?: string
          label: string
          options?: string[] | null
          order_index?: number
          required?: boolean | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_id?: string
          id?: string
          label?: string
          options?: string[] | null
          order_index?: number
          required?: boolean | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          client_id: string | null
          created_at: string
          data: Json
          form_id: string
          id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          data: Json
          form_id: string
          id?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          data?: Json
          form_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "registration_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registration_forms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          elements: Json
          id: string
          is_active: boolean | null
          public_url_key: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          elements?: Json
          id?: string
          is_active?: boolean | null
          public_url_key?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          elements?: Json
          id?: string
          is_active?: boolean | null
          public_url_key?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          created_at: string
          fields: string[]
          format: Database["public"]["Enums"]["report_format"]
          formulas: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fields: string[]
          format?: Database["public"]["Enums"]["report_format"]
          formulas?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fields?: string[]
          format?: Database["public"]["Enums"]["report_format"]
          formulas?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_column_if_not_exists: {
        Args: {
          table_name: string
          column_name: string
          column_type: string
        }
        Returns: undefined
      }
      convert_date_format: {
        Args: {
          input_date: string
        }
        Returns: string
      }
    }
    Enums: {
      client_activity_type:
        | "created"
        | "updated"
        | "document_added"
        | "document_removed"
        | "note_added"
      client_deletion_status: "pending" | "approved" | "rejected"
      form_element_type:
        | "text"
        | "email"
        | "phone"
        | "number"
        | "date"
        | "select"
        | "radio"
        | "checkbox"
        | "textarea"
        | "name"
        | "address"
        | "file"
      report_format: "pdf" | "excel"
      user_role: "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
