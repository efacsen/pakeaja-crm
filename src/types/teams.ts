export interface Team {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  team_lead_id?: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamWithDetails extends Team {
  team_lead_name?: string;
  parent_team_name?: string;
  member_count?: number;
  members?: TeamMember[];
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  joined_at: string;
  role?: string;
}

export interface TeamMemberWithDetails extends TeamMember {
  user_name: string;
  user_email: string;
  user_role: string;
  team_name: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  team_lead_id?: string;
  parent_team_id?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  team_lead_id?: string;
  parent_team_id?: string;
}

export interface TeamFilters {
  search?: string;
  parent_team_id?: string;
  team_lead_id?: string;
}

export interface TeamHierarchy {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  team_lead_id?: string;
  team_lead_name?: string;
  parent_team_id?: string;
  parent_team_name?: string;
  created_at: string;
  updated_at: string;
  children?: TeamHierarchy[];
  member_count?: number;
}

export interface AddTeamMemberRequest {
  user_id: string;
  role?: string;
}

export interface UpdateTeamMemberRequest {
  role?: string;
}