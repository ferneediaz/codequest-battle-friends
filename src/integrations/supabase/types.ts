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
        Args: {
          battle_id: string
        }
        Returns: boolean
      }
      can_manage_battle_participant: {
        Args: {
          participant_id: string
        }
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
