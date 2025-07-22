export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bulk_import_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_log: Json | null
          failed_imports: number | null
          filename: string
          id: string
          initiated_by: string | null
          status: string | null
          successful_imports: number | null
          total_records: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_log?: Json | null
          failed_imports?: number | null
          filename: string
          id?: string
          initiated_by?: string | null
          status?: string | null
          successful_imports?: number | null
          total_records: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_log?: Json | null
          failed_imports?: number | null
          filename?: string
          id?: string
          initiated_by?: string | null
          status?: string | null
          successful_imports?: number | null
          total_records?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          level: string | null
          prerequisites: string[] | null
          tags: string[] | null
          target_role: string | null
          title: string
          total_duration: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          level?: string | null
          prerequisites?: string[] | null
          tags?: string[] | null
          target_role?: string | null
          title: string
          total_duration: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          level?: string | null
          prerequisites?: string[] | null
          tags?: string[] | null
          target_role?: string | null
          title?: string
          total_duration?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          course_sequence: string[]
          created_at: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          target_role: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_sequence: string[]
          created_at?: string | null
          description?: string | null
          estimated_duration?: string | null
          id: string
          target_role?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_sequence?: string[]
          created_at?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          target_role?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          duration: string
          examples: Json | null
          id: string
          module_id: string
          order_index: number
          route: string
          slides: Json | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          duration: string
          examples?: Json | null
          id: string
          module_id: string
          order_index: number
          route: string
          slides?: Json | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          duration?: string
          examples?: Json | null
          id?: string
          module_id?: string
          order_index?: number
          route?: string
          slides?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_id: string
          lesson_id: string | null
          max_participants: number | null
          meeting_link: string | null
          recording_link: string | null
          session_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id: string
          lesson_id?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          recording_link?: string | null
          session_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string
          lesson_id?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          recording_link?: string | null
          session_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          total_duration: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id: string
          order_index: number
          title: string
          total_duration: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          total_duration?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options?: Json | null
          order_index?: number
          question_text: string
          question_type?: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completed_at: string
          id: string
          is_correct: boolean
          lesson_id: string
          question_id: string | null
          user_answer: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          is_correct: boolean
          lesson_id: string
          question_id?: string | null
          user_answer: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          is_correct?: boolean
          lesson_id?: string
          question_id?: string | null
          user_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          attendance_status: string | null
          id: string
          registered_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          id?: string
          registered_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          id?: string
          registered_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invite_token: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invite_token: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          used_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          last_accessed_at: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_accessed_at?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          last_accessed_at?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_or_instructor: {
        Args: { _user_id: string }
        Returns: boolean
      }
      sync_missing_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          synced_count: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student"
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
    Enums: {
      app_role: ["admin", "instructor", "student"],
    },
  },
} as const
