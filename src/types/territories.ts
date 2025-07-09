export interface Territory {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description?: string;
  boundaries?: any; // JSONB field for geographic boundaries
  parent_territory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TerritoryWithDetails extends Territory {
  parent_territory_name?: string;
  user_count?: number;
  assigned_users?: UserTerritoryAssignment[];
}

export interface UserTerritoryAssignment {
  user_id: string;
  territory_id: string;
  assigned_at: string;
  assigned_by?: string;
  is_primary: boolean;
}

export interface UserTerritoryAssignmentWithDetails extends UserTerritoryAssignment {
  user_name: string;
  user_email: string;
  user_role: string;
  territory_name: string;
  territory_code: string;
  assigned_by_name?: string;
}

export interface CreateTerritoryRequest {
  name: string;
  code: string;
  description?: string;
  boundaries?: any;
  parent_territory_id?: string;
}

export interface UpdateTerritoryRequest {
  name?: string;
  code?: string;
  description?: string;
  boundaries?: any;
  parent_territory_id?: string;
}

export interface TerritoryFilters {
  search?: string;
  parent_territory_id?: string;
}

export interface TerritoryHierarchy {
  id: string;
  name: string;
  code: string;
  description?: string;
  organization_id: string;
  parent_territory_id?: string;
  parent_territory_name?: string;
  created_at: string;
  updated_at: string;
  children?: TerritoryHierarchy[];
  user_count?: number;
}

export interface AssignTerritoryRequest {
  user_id: string;
  territory_id: string;
  is_primary?: boolean;
}

export interface TerritoryStats {
  total_territories: number;
  total_assignments: number;
  users_with_territories: number;
  users_without_territories: number;
  primary_assignments: number;
}