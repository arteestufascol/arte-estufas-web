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
      consentimientos_cookies: {
        Row: {
          created_at: string
          decision: Database["public"]["Enums"]["decision_cookies"]
          fecha_hora: string
          id: string
          ip_usuario: string
          sesion_hash: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          decision: Database["public"]["Enums"]["decision_cookies"]
          fecha_hora?: string
          id?: string
          ip_usuario: string
          sesion_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          decision?: Database["public"]["Enums"]["decision_cookies"]
          fecha_hora?: string
          id?: string
          ip_usuario?: string
          sesion_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      cotizacion_productos: {
        Row: {
          cantidad: number
          cotizacion_id: string
          id: string
          producto_id: string
        }
        Insert: {
          cantidad?: number
          cotizacion_id: string
          id?: string
          producto_id: string
        }
        Update: {
          cantidad?: number
          cotizacion_id?: string
          id?: string
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotizacion_productos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizacion_productos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          comentarios_adicionales: string | null
          departamento: string
          direccion_envio: string
          estado: Database["public"]["Enums"]["estado_cotizacion"]
          fecha_actualizacion: string | null
          fecha_solicitud: string
          id: string
          usuario_id: string
        }
        Insert: {
          comentarios_adicionales?: string | null
          departamento: string
          direccion_envio: string
          estado?: Database["public"]["Enums"]["estado_cotizacion"]
          fecha_actualizacion?: string | null
          fecha_solicitud?: string
          id?: string
          usuario_id: string
        }
        Update: {
          comentarios_adicionales?: string | null
          departamento?: string
          direccion_envio?: string
          estado?: Database["public"]["Enums"]["estado_cotizacion"]
          fecha_actualizacion?: string | null
          fecha_solicitud?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cupones_descuento: {
        Row: {
          cantidad_maxima_usos: number
          cantidad_usos_actuales: number
          codigo: string
          creado_por: string
          descripcion: string | null
          estado: string
          fecha_actualizacion: string | null
          fecha_creacion: string
          fecha_inicio: string
          fecha_vencimiento: string
          id: string
          tipo_descuento: string
          valor: number
        }
        Insert: {
          cantidad_maxima_usos?: number
          cantidad_usos_actuales?: number
          codigo: string
          creado_por: string
          descripcion?: string | null
          estado?: string
          fecha_actualizacion?: string | null
          fecha_creacion?: string
          fecha_inicio?: string
          fecha_vencimiento: string
          id?: string
          tipo_descuento: string
          valor: number
        }
        Update: {
          cantidad_maxima_usos?: number
          cantidad_usos_actuales?: number
          codigo?: string
          creado_por?: string
          descripcion?: string | null
          estado?: string
          fecha_actualizacion?: string | null
          fecha_creacion?: string
          fecha_inicio?: string
          fecha_vencimiento?: string
          id?: string
          tipo_descuento?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "cupones_descuento_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          capacidad: string | null
          codigo_referencia: string
          creado_por: string
          descripcion: string | null
          fecha_actualizacion: string | null
          fecha_creacion: string
          foto_url: string | null
          id: string
          materiales: string | null
          nombre: string
          precio: number | null
          preguntar_cotizacion: boolean
          tamano: string | null
        }
        Insert: {
          capacidad?: string | null
          codigo_referencia: string
          creado_por: string
          descripcion?: string | null
          fecha_actualizacion?: string | null
          fecha_creacion?: string
          foto_url?: string | null
          id?: string
          materiales?: string | null
          nombre: string
          precio?: number | null
          preguntar_cotizacion?: boolean
          tamano?: string | null
        }
        Update: {
          capacidad?: string | null
          codigo_referencia?: string
          creado_por?: string
          descripcion?: string | null
          fecha_actualizacion?: string | null
          fecha_creacion?: string
          foto_url?: string | null
          id?: string
          materiales?: string | null
          nombre?: string
          precio?: number | null
          preguntar_cotizacion?: boolean
          tamano?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sesiones: {
        Row: {
          fecha_expiracion: string
          fecha_inicio: string
          id: string
          token: string
          usuario_id: string
        }
        Insert: {
          fecha_expiracion: string
          fecha_inicio?: string
          id?: string
          token: string
          usuario_id: string
        }
        Update: {
          fecha_expiracion?: string
          fecha_inicio?: string
          id?: string
          token?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      trabajos: {
        Row: {
          cotizacion_id: string
          fecha_asignacion: string
          id: string
          observaciones: string | null
        }
        Insert: {
          cotizacion_id: string
          fecha_asignacion?: string
          id?: string
          observaciones?: string | null
        }
        Update: {
          cotizacion_id?: string
          fecha_asignacion?: string
          id?: string
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trabajos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: true
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          apellido: string
          cedula: string
          departamento: string | null
          direccion: string | null
          estado: Database["public"]["Enums"]["estado_usuario"]
          fecha_registro: string
          id: string
          nombre: string
          pais: string | null
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: string | null
          tipo_documento: Database["public"]["Enums"]["tipo_documento"]
        }
        Insert: {
          apellido: string
          cedula: string
          departamento?: string | null
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_usuario"]
          fecha_registro?: string
          id: string
          nombre: string
          pais?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"]
        }
        Update: {
          apellido?: string
          cedula?: string
          departamento?: string | null
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_usuario"]
          fecha_registro?: string
          id?: string
          nombre?: string
          pais?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["rol_usuario"]
      }
    }
    Enums: {
      decision_cookies: "aceptado" | "rechazado"
      estado_cotizacion:
        | "cotizacion-pendiente"
        | "cotizacion-hecha"
        | "trabajo-contratado"
      estado_usuario: "activo" | "inactivo"
      rol_usuario: "admin" | "cliente" | "usuario"
      tipo_documento: "CC" | "TI" | "CE" | "PASAPORTE"
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
      decision_cookies: ["aceptado", "rechazado"],
      estado_cotizacion: [
        "cotizacion-pendiente",
        "cotizacion-hecha",
        "trabajo-contratado",
      ],
      estado_usuario: ["activo", "inactivo"],
      rol_usuario: ["admin", "cliente", "usuario"],
      tipo_documento: ["CC", "TI", "CE", "PASAPORTE"],
    },
  },
} as const
