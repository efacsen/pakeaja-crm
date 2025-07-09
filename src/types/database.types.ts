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
      activities: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          follow_up_date: string | null
          id: string
          is_completed: boolean | null
          lead_id: string | null
          next_action: string | null
          outcome: string | null
          scheduled_at: string | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          is_completed?: boolean | null
          lead_id?: string | null
          next_action?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          is_completed?: boolean | null
          lead_id?: string | null
          next_action?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          organization_id: string | null
          resource_id: string | null
          resource_type: Database["public"]["Enums"]["resource_type"] | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      canvassing_photos: {
        Row: {
          created_at: string | null
          id: string
          photo_url: string | null
          report_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          report_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvassing_photos_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "canvassing_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      canvassing_reports: {
        Row: {
          address: string
          business_type: string | null
          company_address: string | null
          company_id: string | null
          company_name: string
          competitor_price: number | null
          competitors_mentioned: string[] | null
          contact_email: string | null
          contact_id: string | null
          contact_person: string | null
          contact_phone: string | null
          contact_position: string | null
          converted_to_lead: boolean | null
          created_at: string | null
          created_by: string | null
          current_supplier: string | null
          decision_maker_met: boolean | null
          decision_timeline: string | null
          duration_minutes: number | null
          email: string | null
          follow_up_date: string | null
          general_notes: string | null
          gps_coordinates: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          lead_id: string | null
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          opportunities: string | null
          outcome: string
          pain_points: string | null
          phone: string | null
          photo_urls: string[] | null
          potential_area: number | null
          potential_materials: string | null
          potential_type: string | null
          potential_value: number | null
          priority: string | null
          project_segment: string | null
          project_value: number | null
          sales_rep_id: string | null
          sales_rep_name: string | null
          timeline_months: number | null
          updated_at: string | null
          user_id: string
          visit_date: string
          visit_outcome: string | null
          visit_time: string | null
        }
        Insert: {
          address: string
          business_type?: string | null
          company_address?: string | null
          company_id?: string | null
          company_name: string
          competitor_price?: number | null
          competitors_mentioned?: string[] | null
          contact_email?: string | null
          contact_id?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          converted_to_lead?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_supplier?: string | null
          decision_maker_met?: boolean | null
          decision_timeline?: string | null
          duration_minutes?: number | null
          email?: string | null
          follow_up_date?: string | null
          general_notes?: string | null
          gps_coordinates?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          opportunities?: string | null
          outcome: string
          pain_points?: string | null
          phone?: string | null
          photo_urls?: string[] | null
          potential_area?: number | null
          potential_materials?: string | null
          potential_type?: string | null
          potential_value?: number | null
          priority?: string | null
          project_segment?: string | null
          project_value?: number | null
          sales_rep_id?: string | null
          sales_rep_name?: string | null
          timeline_months?: number | null
          updated_at?: string | null
          user_id: string
          visit_date: string
          visit_outcome?: string | null
          visit_time?: string | null
        }
        Update: {
          address?: string
          business_type?: string | null
          company_address?: string | null
          company_id?: string | null
          company_name?: string
          competitor_price?: number | null
          competitors_mentioned?: string[] | null
          contact_email?: string | null
          contact_id?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contact_position?: string | null
          converted_to_lead?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_supplier?: string | null
          decision_maker_met?: boolean | null
          decision_timeline?: string | null
          duration_minutes?: number | null
          email?: string | null
          follow_up_date?: string | null
          general_notes?: string | null
          gps_coordinates?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          opportunities?: string | null
          outcome?: string
          pain_points?: string | null
          phone?: string | null
          photo_urls?: string[] | null
          potential_area?: number | null
          potential_materials?: string | null
          potential_type?: string | null
          potential_value?: number | null
          priority?: string | null
          project_segment?: string | null
          project_value?: number | null
          sales_rep_id?: string | null
          sales_rep_name?: string | null
          timeline_months?: number | null
          updated_at?: string | null
          user_id?: string
          visit_date?: string
          visit_outcome?: string | null
          visit_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvassing_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvassing_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "canvassing_reports_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "canvassing_reports_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvassing_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvassing_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coating_calculation_materials: {
        Row: {
          calculation_id: string | null
          coats: number | null
          coverage_rate: number | null
          created_at: string | null
          id: string
          loss_factor: number | null
          manufacturer: string | null
          material_id: string | null
          material_name: string
          material_type: string | null
          package_size: number | null
          packages_needed: number | null
          practical_usage: number | null
          price_per_liter: number | null
          theoretical_usage: number | null
          thickness_per_coat: number | null
          total_price: number | null
          total_thickness: number | null
          volume_solids: number | null
        }
        Insert: {
          calculation_id?: string | null
          coats?: number | null
          coverage_rate?: number | null
          created_at?: string | null
          id?: string
          loss_factor?: number | null
          manufacturer?: string | null
          material_id?: string | null
          material_name: string
          material_type?: string | null
          package_size?: number | null
          packages_needed?: number | null
          practical_usage?: number | null
          price_per_liter?: number | null
          theoretical_usage?: number | null
          thickness_per_coat?: number | null
          total_price?: number | null
          total_thickness?: number | null
          volume_solids?: number | null
        }
        Update: {
          calculation_id?: string | null
          coats?: number | null
          coverage_rate?: number | null
          created_at?: string | null
          id?: string
          loss_factor?: number | null
          manufacturer?: string | null
          material_id?: string | null
          material_name?: string
          material_type?: string | null
          package_size?: number | null
          packages_needed?: number | null
          practical_usage?: number | null
          price_per_liter?: number | null
          theoretical_usage?: number | null
          thickness_per_coat?: number | null
          total_price?: number | null
          total_thickness?: number | null
          volume_solids?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coating_calculation_materials_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "coating_calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      coating_calculations: {
        Row: {
          coating_system_id: string | null
          coating_system_name: string | null
          company_id: string | null
          company_name: string | null
          contact_email: string | null
          contact_id: string | null
          contact_name: string | null
          contact_phone: string | null
          contingency_percentage: number | null
          created_at: string | null
          created_by: string | null
          engineering_cost: number | null
          environment_type: string | null
          equipment_cost: number | null
          final_price: number | null
          id: string
          labor_cost: number | null
          material_cost: number | null
          mobilization_cost: number | null
          notes: string | null
          overhead_percentage: number | null
          profit_margin: number | null
          project_address: string | null
          project_date: string | null
          project_name: string
          status: string | null
          surface_area: number
          surface_condition: string | null
          surface_type: string | null
          total_cost: number | null
          total_thickness: number | null
          updated_at: string | null
          valid_until: string | null
          warranty_years: number | null
        }
        Insert: {
          coating_system_id?: string | null
          coating_system_name?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contingency_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          engineering_cost?: number | null
          environment_type?: string | null
          equipment_cost?: number | null
          final_price?: number | null
          id?: string
          labor_cost?: number | null
          material_cost?: number | null
          mobilization_cost?: number | null
          notes?: string | null
          overhead_percentage?: number | null
          profit_margin?: number | null
          project_address?: string | null
          project_date?: string | null
          project_name: string
          status?: string | null
          surface_area: number
          surface_condition?: string | null
          surface_type?: string | null
          total_cost?: number | null
          total_thickness?: number | null
          updated_at?: string | null
          valid_until?: string | null
          warranty_years?: number | null
        }
        Update: {
          coating_system_id?: string | null
          coating_system_name?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contingency_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          engineering_cost?: number | null
          environment_type?: string | null
          equipment_cost?: number | null
          final_price?: number | null
          id?: string
          labor_cost?: number | null
          material_cost?: number | null
          mobilization_cost?: number | null
          notes?: string | null
          overhead_percentage?: number | null
          profit_margin?: number | null
          project_address?: string | null
          project_date?: string | null
          project_name?: string
          status?: string | null
          surface_area?: number
          surface_condition?: string | null
          surface_type?: string | null
          total_cost?: number | null
          total_thickness?: number | null
          updated_at?: string | null
          valid_until?: string | null
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coating_calculations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coating_calculations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "coating_calculations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "coating_calculations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coating_calculations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          lead_id: string | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          lead_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          lead_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          company_type: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          discount_percentage: number | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          payment_terms: number | null
          postal_code: string | null
          state_province: string | null
          status: string | null
          tax_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          discount_percentage?: number | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          payment_terms?: number | null
          postal_code?: string | null
          state_province?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          discount_percentage?: number | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          payment_terms?: number | null
          postal_code?: string | null
          state_province?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          mobile_phone: string | null
          name: string
          notes: string | null
          office_phone: string | null
          position: string | null
          preferred_contact_method: string | null
          preferred_language: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          mobile_phone?: string | null
          name: string
          notes?: string | null
          office_phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          mobile_phone?: string | null
          name?: string
          notes?: string | null
          office_phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          notes: string | null
          npwp: string | null
          phone: string | null
          territory: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          npwp?: string | null
          phone?: string | null
          territory?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          npwp?: string | null
          phone?: string | null
          territory?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string | null
          entity_id: string | null
          entity_type: string | null
          file_size: number | null
          file_url: string | null
          id: string
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          paid_amount: number | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          project_id: string | null
          quote_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_quotes: {
        Row: {
          created_at: string | null
          lead_id: string
          quote_id: string
        }
        Insert: {
          created_at?: string | null
          lead_id: string
          quote_id: string
        }
        Update: {
          created_at?: string | null
          lead_id?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          activity_count: number | null
          address: string | null
          assigned_to: string | null
          canvassing_report_id: string | null
          company_id: string | null
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          customer_id: string | null
          days_in_stage: number | null
          deal_type: Database["public"]["Enums"]["deal_type"] | null
          description: string | null
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          last_activity_date: string | null
          lost_at: string | null
          lost_reason: string | null
          probability: number | null
          project_name: string | null
          project_segment: Database["public"]["Enums"]["project_segment"] | null
          source: string | null
          stage: Database["public"]["Enums"]["lead_stage"] | null
          tags: string[] | null
          temperature:
            | Database["public"]["Enums"]["lead_temperature_status"]
            | null
          title: string
          updated_at: string | null
          won_at: string | null
        }
        Insert: {
          activity_count?: number | null
          address?: string | null
          assigned_to?: string | null
          canvassing_report_id?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          days_in_stage?: number | null
          deal_type?: Database["public"]["Enums"]["deal_type"] | null
          description?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          probability?: number | null
          project_name?: string | null
          project_segment?:
            | Database["public"]["Enums"]["project_segment"]
            | null
          source?: string | null
          stage?: Database["public"]["Enums"]["lead_stage"] | null
          tags?: string[] | null
          temperature?:
            | Database["public"]["Enums"]["lead_temperature_status"]
            | null
          title: string
          updated_at?: string | null
          won_at?: string | null
        }
        Update: {
          activity_count?: number | null
          address?: string | null
          assigned_to?: string | null
          canvassing_report_id?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          days_in_stage?: number | null
          deal_type?: Database["public"]["Enums"]["deal_type"] | null
          description?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          probability?: number | null
          project_name?: string | null
          project_segment?:
            | Database["public"]["Enums"]["project_segment"]
            | null
          source?: string | null
          stage?: Database["public"]["Enums"]["lead_stage"] | null
          tags?: string[] | null
          temperature?:
            | Database["public"]["Enums"]["lead_temperature_status"]
            | null
          title?: string
          updated_at?: string | null
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_canvassing_report_id_fkey"
            columns: ["canvassing_report_id"]
            isOneToOne: false
            referencedRelation: "canvassing_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      material_compatibility: {
        Row: {
          compatibility_type: string | null
          compatible_with_id: string
          created_at: string | null
          material_id: string
          notes: string | null
        }
        Insert: {
          compatibility_type?: string | null
          compatible_with_id: string
          created_at?: string | null
          material_id: string
          notes?: string | null
        }
        Update: {
          compatibility_type?: string | null
          compatible_with_id?: string
          created_at?: string | null
          material_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_compatibility_compatible_with_id_fkey"
            columns: ["compatible_with_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_compatibility_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          application_method: string[] | null
          category: string | null
          created_at: string | null
          currency: string | null
          discontinued_date: string | null
          flash_point: number | null
          full_cure_days: number | null
          hard_dry_hours: number | null
          id: string
          is_active: boolean | null
          manufacturer: string
          material_code: string | null
          pot_life_hours: number | null
          price_per_liter: number | null
          product_name: string
          product_type: string | null
          recoat_max_hours: number | null
          recoat_min_hours: number | null
          recommended_dft_max: number | null
          recommended_dft_min: number | null
          replacement_material_id: string | null
          specific_gravity: number | null
          standard_pack_size: number | null
          theoretical_coverage: number | null
          thinner_type: string | null
          thinning_ratio_max: number | null
          thinning_ratio_min: number | null
          touch_dry_hours: number | null
          updated_at: string | null
          volume_solids: number | null
        }
        Insert: {
          application_method?: string[] | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          discontinued_date?: string | null
          flash_point?: number | null
          full_cure_days?: number | null
          hard_dry_hours?: number | null
          id?: string
          is_active?: boolean | null
          manufacturer: string
          material_code?: string | null
          pot_life_hours?: number | null
          price_per_liter?: number | null
          product_name: string
          product_type?: string | null
          recoat_max_hours?: number | null
          recoat_min_hours?: number | null
          recommended_dft_max?: number | null
          recommended_dft_min?: number | null
          replacement_material_id?: string | null
          specific_gravity?: number | null
          standard_pack_size?: number | null
          theoretical_coverage?: number | null
          thinner_type?: string | null
          thinning_ratio_max?: number | null
          thinning_ratio_min?: number | null
          touch_dry_hours?: number | null
          updated_at?: string | null
          volume_solids?: number | null
        }
        Update: {
          application_method?: string[] | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          discontinued_date?: string | null
          flash_point?: number | null
          full_cure_days?: number | null
          hard_dry_hours?: number | null
          id?: string
          is_active?: boolean | null
          manufacturer?: string
          material_code?: string | null
          pot_life_hours?: number | null
          price_per_liter?: number | null
          product_name?: string
          product_type?: string | null
          recoat_max_hours?: number | null
          recoat_min_hours?: number | null
          recommended_dft_max?: number | null
          recommended_dft_min?: number | null
          replacement_material_id?: string | null
          specific_gravity?: number | null
          standard_pack_size?: number | null
          theoretical_coverage?: number | null
          thinner_type?: string | null
          thinning_ratio_max?: number | null
          thinning_ratio_min?: number | null
          touch_dry_hours?: number | null
          updated_at?: string | null
          volume_solids?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_replacement_material_id_fkey"
            columns: ["replacement_material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions: Json | null
          created_at: string | null
          id: string
          organization_id: string | null
          resource: Database["public"]["Enums"]["resource_type"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          resource: Database["public"]["Enums"]["resource_type"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          resource?: Database["public"]["Enums"]["resource_type"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          organization_id: string | null
          permissions: Json | null
          phone: string | null
          position: string | null
          preferences: Json | null
          reports_to: string | null
          role: Database["public"]["Enums"]["user_role"]
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          joined_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          reports_to?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          reports_to?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          created_at: string | null
          description: string | null
          id: string
          invoice_percentage: number | null
          is_invoiced: boolean | null
          milestone_name: string
          milestone_value: number | null
          planned_end_date: string | null
          planned_start_date: string | null
          progress_percentage: number | null
          project_id: string | null
          sequence_number: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_percentage?: number | null
          is_invoiced?: boolean | null
          milestone_name: string
          milestone_value?: number | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          progress_percentage?: number | null
          project_id?: string | null
          sequence_number?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_percentage?: number | null
          is_invoiced?: boolean | null
          milestone_name?: string
          milestone_value?: number | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          progress_percentage?: number | null
          project_id?: string | null
          sequence_number?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          assigned_date: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          project_id: string | null
          removed_date: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          assigned_date?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          removed_date?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_date?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          removed_date?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          calculation_id: string | null
          company_id: string | null
          contract_value: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          foreman_id: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          invoiced_amount: number | null
          issues_count: number | null
          paid_amount: number | null
          progress_percentage: number | null
          project_code: string | null
          project_manager_id: string | null
          project_name: string
          project_type: string | null
          quote_id: string | null
          retention_amount: number | null
          risk_level: string | null
          site_address: string | null
          site_city: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          calculation_id?: string | null
          company_id?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          foreman_id?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          invoiced_amount?: number | null
          issues_count?: number | null
          paid_amount?: number | null
          progress_percentage?: number | null
          project_code?: string | null
          project_manager_id?: string | null
          project_name: string
          project_type?: string | null
          quote_id?: string | null
          retention_amount?: number | null
          risk_level?: string | null
          site_address?: string | null
          site_city?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          calculation_id?: string | null
          company_id?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          foreman_id?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          invoiced_amount?: number | null
          issues_count?: number | null
          paid_amount?: number | null
          progress_percentage?: number | null
          project_code?: string | null
          project_manager_id?: string | null
          project_name?: string
          project_type?: string | null
          quote_id?: string | null
          retention_amount?: number | null
          risk_level?: string | null
          site_address?: string | null
          site_city?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "coating_calculations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_foreman_id_fkey"
            columns: ["foreman_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string | null
          description: string
          discount_percentage: number | null
          id: string
          item_code: string | null
          item_type: string | null
          quantity: number | null
          quote_id: string | null
          sequence_number: number | null
          subtotal: number | null
          total: number | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_percentage?: number | null
          id?: string
          item_code?: string | null
          item_type?: string | null
          quantity?: number | null
          quote_id?: string | null
          sequence_number?: number | null
          subtotal?: number | null
          total?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_percentage?: number | null
          id?: string
          item_code?: string | null
          item_type?: string | null
          quantity?: number | null
          quote_id?: string | null
          sequence_number?: number | null
          subtotal?: number | null
          total?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          calculation_id: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          decided_date: string | null
          delivery_terms: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          issue_date: string | null
          lead_id: string | null
          parent_quote_id: string | null
          payment_terms: string | null
          quote_number: string | null
          rejection_reason: string | null
          sent_date: string | null
          special_conditions: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_percentage: number | null
          title: string
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
          version: number | null
          viewed_date: string | null
          warranty_terms: string | null
        }
        Insert: {
          calculation_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          decided_date?: string | null
          delivery_terms?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          issue_date?: string | null
          lead_id?: string | null
          parent_quote_id?: string | null
          payment_terms?: string | null
          quote_number?: string | null
          rejection_reason?: string | null
          sent_date?: string | null
          special_conditions?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percentage?: number | null
          title: string
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          viewed_date?: string | null
          warranty_terms?: string | null
        }
        Update: {
          calculation_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          decided_date?: string | null
          delivery_terms?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          issue_date?: string | null
          lead_id?: string | null
          parent_quote_id?: string | null
          payment_terms?: string | null
          quote_number?: string | null
          rejection_reason?: string | null
          sent_date?: string | null
          special_conditions?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percentage?: number | null
          title?: string
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          viewed_date?: string | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "coating_calculations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "quotes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "quotes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_parent_quote_id_fkey"
            columns: ["parent_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      role_hierarchy: {
        Row: {
          child_role: Database["public"]["Enums"]["user_role"]
          organization_id: string
          parent_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          child_role: Database["public"]["Enums"]["user_role"]
          organization_id: string
          parent_role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          child_role?: Database["public"]["Enums"]["user_role"]
          organization_id?: string
          parent_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_hierarchy_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          joined_at: string | null
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          parent_team_id: string | null
          team_lead_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_team_id?: string | null
          team_lead_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_team_id?: string | null
          team_lead_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "team_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temperature_history: {
        Row: {
          dew_point: number | null
          gps_latitude: number | null
          gps_longitude: number | null
          humidity: number | null
          id: string
          measured_at: string | null
          measured_by: string | null
          measurement_location: string | null
          project_id: string | null
          substrate_temp: number | null
          temperature: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          dew_point?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          humidity?: number | null
          id?: string
          measured_at?: string | null
          measured_by?: string | null
          measurement_location?: string | null
          project_id?: string | null
          substrate_temp?: number | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          dew_point?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          humidity?: number | null
          id?: string
          measured_at?: string | null
          measured_by?: string | null
          measurement_location?: string | null
          project_id?: string | null
          substrate_temp?: number | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "temperature_history_measured_by_fkey"
            columns: ["measured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temperature_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      territories: {
        Row: {
          boundaries: Json | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          parent_territory_id: string | null
          updated_at: string | null
        }
        Insert: {
          boundaries?: Json | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_territory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          boundaries?: Json | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_territory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territories_parent_territory_id_fkey"
            columns: ["parent_territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_territories: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          is_primary: boolean | null
          territory_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          is_primary?: boolean | null
          territory_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          is_primary?: boolean | null
          territory_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_territories_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          territory: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          is_active?: boolean | null
          phone?: string | null
          territory?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          territory?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      warranties: {
        Row: {
          claims_count: number | null
          company_id: string | null
          coverage_details: string | null
          coverage_type: string | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          exclusions: string | null
          id: string
          last_claim_date: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          warranty_number: string | null
          warranty_years: number | null
        }
        Insert: {
          claims_count?: number | null
          company_id?: string | null
          coverage_details?: string | null
          coverage_type?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          exclusions?: string | null
          id?: string
          last_claim_date?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          warranty_number?: string | null
          warranty_years?: number | null
        }
        Update: {
          claims_count?: number | null
          company_id?: string | null
          coverage_details?: string | null
          coverage_type?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          exclusions?: string | null
          id?: string
          last_claim_date?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          warranty_number?: string | null
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "warranties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_contacts: {
        Row: {
          company_city: string | null
          company_id: string | null
          company_name: string | null
          company_status: string | null
          contact_id: string | null
          contact_name: string | null
          email: string | null
          is_primary: boolean | null
          mobile_phone: string | null
          position: string | null
          whatsapp: string | null
        }
        Relationships: []
      }
      team_hierarchy: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          organization_id: string | null
          parent_team_id: string | null
          parent_team_name: string | null
          team_lead_id: string | null
          team_lead_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "team_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_created_at: string | null
          auth_email: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          employee_id: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          joined_at: string | null
          last_sign_in_at: string | null
          organization_id: string | null
          permissions: Json | null
          phone: string | null
          position: string | null
          preferences: Json | null
          reports_to: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          settings: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_team_memberships: {
        Row: {
          joined_at: string | null
          team_id: string | null
          team_name: string | null
          team_role: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_territory_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_by_name: string | null
          is_primary: boolean | null
          territory_code: string | null
          territory_id: string | null
          territory_name: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_territories_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_territories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_permission: {
        Args: {
          p_user_id: string
          p_resource: Database["public"]["Enums"]["resource_type"]
          p_action: Database["public"]["Enums"]["permission_action"]
          p_resource_id?: string
        }
        Returns: boolean
      }
      create_profile_if_missing: {
        Args: {
          user_id: string
          user_email?: string
          user_name?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
      get_or_create_company: {
        Args:
          | { p_company_name: string; p_city?: string; p_address?: string }
          | { p_company_name: string; p_city?: string; p_address?: string }
        Returns: string
      }
      get_user_organization: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_superadmin: {
        Args: { user_id: string }
        Returns: boolean
      }
      safe_create_profile: {
        Args: {
          p_id: string
          p_email: string
          p_full_name: string
          p_role: Database["public"]["Enums"]["user_role"]
          p_organization_id: string
        }
        Returns: boolean
      }
      search_companies_with_contacts: {
        Args:
          | { search_term: string; limit_count?: number }
          | { search_term: string; limit_count?: number }
        Returns: {
          company_id: string
          company_name: string
          company_city: string
          contact_id: string
          contact_name: string
          contact_position: string
          contact_email: string
          contact_phone: string
          match_type: string
        }[]
      }
    }
    Enums: {
      activity_type:
        | "phone_call"
        | "email_sent"
        | "meeting_scheduled"
        | "meeting_completed"
        | "quote_sent"
        | "site_visit"
        | "check_availability"
        | "apply_discount"
        | "quote_revised"
        | "escalate_manager"
        | "request_po"
        | "extend_timeline"
        | "follow_up"
        | "note_added"
      canvassing_outcome:
        | "interested"
        | "not_interested"
        | "follow_up_needed"
        | "already_customer"
        | "competitor_locked"
      canvassing_priority: "low" | "medium" | "high" | "urgent"
      deal_type: "supply" | "apply" | "supply_apply"
      lead_stage:
        | "lead"
        | "qualified"
        | "negotiation"
        | "closing"
        | "won"
        | "lost"
      lead_temperature_status: "cold" | "warm" | "hot" | "critical"
      permission_action:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "approve"
        | "export"
      project_segment:
        | "residential"
        | "commercial"
        | "industrial"
        | "infrastructure"
        | "marine"
        | "others"
      resource_type:
        | "users"
        | "contacts"
        | "leads"
        | "opportunities"
        | "quotes"
        | "projects"
        | "materials"
        | "calculations"
        | "reports"
        | "documents"
        | "settings"
      user_role:
        | "admin"
        | "manager"
        | "sales"
        | "estimator"
        | "project_manager"
        | "foreman"
        | "inspector"
        | "client"
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
      activity_type: [
        "phone_call",
        "email_sent",
        "meeting_scheduled",
        "meeting_completed",
        "quote_sent",
        "site_visit",
        "check_availability",
        "apply_discount",
        "quote_revised",
        "escalate_manager",
        "request_po",
        "extend_timeline",
        "follow_up",
        "note_added",
      ],
      canvassing_outcome: [
        "interested",
        "not_interested",
        "follow_up_needed",
        "already_customer",
        "competitor_locked",
      ],
      canvassing_priority: ["low", "medium", "high", "urgent"],
      deal_type: ["supply", "apply", "supply_apply"],
      lead_stage: [
        "lead",
        "qualified",
        "negotiation",
        "closing",
        "won",
        "lost",
      ],
      lead_temperature_status: ["cold", "warm", "hot", "critical"],
      permission_action: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "export",
      ],
      project_segment: [
        "residential",
        "commercial",
        "industrial",
        "infrastructure",
        "marine",
        "others",
      ],
      resource_type: [
        "users",
        "contacts",
        "leads",
        "opportunities",
        "quotes",
        "projects",
        "materials",
        "calculations",
        "reports",
        "documents",
        "settings",
      ],
      user_role: [
        "admin",
        "manager",
        "sales",
        "estimator",
        "project_manager",
        "foreman",
        "inspector",
        "client",
      ],
    },
  },
} as const
