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
      battle_participants: {
        Row: {
          battle_id: string
          current_code: string | null
          id: string
          joined_at: string
          role: string | null
          team: string
          user_id: string
        }
        Insert: {
          battle_id: string
          current_code?: string | null
          id?: string
          joined_at?: string
          role?: string | null
          team: string
          user_id: string
        }
        Update: {
          battle_id?: string
          current_code?: string | null
          id?: string
          joined_at?: string
          role?: string | null
          team?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_participants_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          comm_challenge: boolean | null
          created_at: string
          current_participants: number | null
          document_content: string | null
          id: string
          max_participants: number | null
          max_rank: string
          min_rank: string
          question_id: string
          room_code: string | null
          shared_document_id: string | null
          status: Database["public"]["Enums"]["room_status"]
          team_a_score: number | null
          team_b_score: number | null
        }
        Insert: {
          comm_challenge?: boolean | null
          created_at?: string
          current_participants?: number | null
          document_content?: string | null
          id?: string
          max_participants?: number | null
          max_rank?: string
          min_rank?: string
          question_id: string
          room_code?: string | null
          shared_document_id?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          team_a_score?: number | null
          team_b_score?: number | null
        }
        Update: {
          comm_challenge?: boolean | null
          created_at?: string
          current_participants?: number | null
          document_content?: string | null
          id?: string
          max_participants?: number | null
          max_rank?: string
          min_rank?: string
          question_id?: string
          room_code?: string | null
          shared_document_id?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          team_a_score?: number | null
          team_b_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          constraints: string[] | null
          created_at: string | null
          description: string
          difficulty: string
          examples: Json | null
          id: string
          initial_code: Json | null
          test_cases: Json | null
          title: string
        }
        Insert: {
          category: string
          constraints?: string[] | null
          created_at?: string | null
          description: string
          difficulty: string
          examples?: Json | null
          id?: string
          initial_code?: Json | null
          test_cases?: Json | null
          title: string
        }
        Update: {
          category?: string
          constraints?: string[] | null
          created_at?: string | null
          description?: string
          difficulty?: string
          examples?: Json | null
          id?: string
          initial_code?: Json | null
          test_cases?: Json | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_battle: {
        Args: { battle_id: string }
        Returns: boolean
      }
      can_manage_battle_participant: {
        Args: { participant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      battle_status: "waiting" | "in_progress" | "completed"
      room_status: "waiting" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      battle_status: ["waiting", "in_progress", "completed"],
      room_status: ["waiting", "in_progress", "completed"],
    },
  },
} as const
