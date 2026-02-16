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
      koujou_exercise_entries: {
        Row: {
          id: string;
          session_id: string;
          actual_sets: number | null;
          actual_reps: number | null;
          actual_weight: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          actual_sets?: number | null;
          actual_reps?: number | null;
          actual_weight?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          actual_sets?: number | null;
          actual_reps?: number | null;
          actual_weight?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "koujou_exercise_entries_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "koujou_workout_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      koujou_exercises: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          notes: string | null;
          created_at: string;
          workout_id: string | null;
          planned_sets: number | null;
          planned_reps: number | null;
          planned_weight: number | null;
          planned_rest_seconds: number | null;
          planned_notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          notes?: string | null;
          created_at?: string;
          workout_id?: string | null;
          planned_sets?: number | null;
          planned_reps?: number | null;
          planned_weight?: number | null;
          planned_rest_seconds?: number | null;
          planned_notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          notes?: string | null;
          created_at?: string;
          workout_id?: string | null;
          planned_sets?: number | null;
          planned_reps?: number | null;
          planned_weight?: number | null;
          planned_rest_seconds?: number | null;
          planned_notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "koujou_exercises_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "koujou_exercises_workout_id_fkey";
            columns: ["workout_id"];
            isOneToOne: false;
            referencedRelation: "koujou_workouts";
            referencedColumns: ["id"];
          },
        ];
      };
      koujou_workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          performed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          performed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          performed_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "koujou_workout_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "koujou_workout_sessions_workout_id_fkey";
            columns: ["workout_id"];
            isOneToOne: false;
            referencedRelation: "koujou_workouts";
            referencedColumns: ["id"];
          },
        ];
      };
      koujou_workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          weekday: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          weekday: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          weekday?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "koujou_workouts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      zaimu_overviews: {
        Row: {
          id: number;
          name: string;
          type: string;
          date: string | null;
          user_id: string;
          keep_data: boolean;
          multi: number;
        };
        Insert: {
          id?: never;
          name: string;
          type: string;
          date?: string | null;
          user_id: string;
          keep_data?: boolean;
          multi?: number;
        };
        Update: {
          id?: never;
          name?: string;
          type?: string;
          date?: string | null;
          user_id?: string;
          keep_data?: boolean;
          multi?: number;
        };
        Relationships: [
          {
            foreignKeyName: "zaimu_overviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      zaimu_transactions: {
        Row: {
          id: number;
          name: string;
          amount: number;
          type: string;
          overview_id: number;
          date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: never;
          name: string;
          amount: number;
          type: string;
          overview_id: number;
          date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: never;
          name?: string;
          amount?: number;
          type?: string;
          overview_id?: number;
          date?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "zaimu_transactions_overview_id_fkey";
            columns: ["overview_id"];
            isOneToOne: false;
            referencedRelation: "zaimu_overviews";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
