import { createClient } from '@/lib/supabase/client';
import { 
  Team, 
  TeamWithDetails, 
  TeamMember, 
  TeamMemberWithDetails, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  TeamFilters, 
  TeamHierarchy,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest
} from '@/types/teams';

export class TeamsService {
  private supabase = createClient();

  // Get all teams for the current organization
  async getTeams(filters?: TeamFilters): Promise<{ data: TeamWithDetails[] | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('team_hierarchy')
        .select('*')
        .order('name');

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.parent_team_id) {
        query = query.eq('parent_team_id', filters.parent_team_id);
      }

      if (filters?.team_lead_id) {
        query = query.eq('team_lead_id', filters.team_lead_id);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Get member counts for each team
      const teamsWithCounts = await Promise.all(
        (data || []).map(async (team) => {
          const { count } = await this.supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id);

          return {
            ...team,
            member_count: count || 0,
          };
        })
      );

      return { data: teamsWithCounts, error: null };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { data: null, error: 'Failed to fetch teams' };
    }
  }

  // Get team hierarchy
  async getTeamHierarchy(): Promise<{ data: TeamHierarchy[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('team_hierarchy')
        .select('*')
        .order('name');

      if (error) {
        return { data: null, error: error.message };
      }

      // Build hierarchy structure
      const hierarchy = this.buildTeamHierarchy(data || []);
      return { data: hierarchy, error: null };
    } catch (error) {
      console.error('Error fetching team hierarchy:', error);
      return { data: null, error: 'Failed to fetch team hierarchy' };
    }
  }

  // Build hierarchical structure from flat data
  private buildTeamHierarchy(teams: TeamHierarchy[]): TeamHierarchy[] {
    const teamMap = new Map<string, TeamHierarchy>();
    const rootTeams: TeamHierarchy[] = [];

    // Create map and initialize children arrays
    teams.forEach(team => {
      teamMap.set(team.id, { ...team, children: [] });
    });

    // Build hierarchy
    teams.forEach(team => {
      const teamNode = teamMap.get(team.id)!;
      if (team.parent_team_id) {
        const parent = teamMap.get(team.parent_team_id);
        if (parent) {
          parent.children!.push(teamNode);
        }
      } else {
        rootTeams.push(teamNode);
      }
    });

    return rootTeams;
  }

  // Get single team by ID
  async getTeam(id: string): Promise<{ data: TeamWithDetails | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('team_hierarchy')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Get team members
      const { data: members } = await this.supabase
        .from('user_team_memberships')
        .select('*')
        .eq('team_id', id);

      return { 
        data: {
          ...data,
          members: members || [],
          member_count: members?.length || 0,
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching team:', error);
      return { data: null, error: 'Failed to fetch team' };
    }
  }

  // Create new team
  async createTeam(teamData: CreateTeamRequest): Promise<{ data: Team | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating team:', error);
      return { data: null, error: 'Failed to create team' };
    }
  }

  // Update team
  async updateTeam(id: string, teamData: UpdateTeamRequest): Promise<{ data: Team | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('teams')
        .update({ ...teamData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating team:', error);
      return { data: null, error: 'Failed to update team' };
    }
  }

  // Delete team
  async deleteTeam(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error deleting team:', error);
      return { data: false, error: 'Failed to delete team' };
    }
  }

  // Get team members
  async getTeamMembers(teamId: string): Promise<{ data: TeamMemberWithDetails[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_team_memberships')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching team members:', error);
      return { data: null, error: 'Failed to fetch team members' };
    }
  }

  // Add team member
  async addTeamMember(
    teamId: string, 
    memberData: AddTeamMemberRequest
  ): Promise<{ data: TeamMember | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          ...memberData,
        }])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error adding team member:', error);
      return { data: null, error: 'Failed to add team member' };
    }
  }

  // Update team member
  async updateTeamMember(
    teamId: string, 
    userId: string, 
    memberData: UpdateTeamMemberRequest
  ): Promise<{ data: TeamMember | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('team_members')
        .update(memberData)
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating team member:', error);
      return { data: null, error: 'Failed to update team member' };
    }
  }

  // Remove team member
  async removeTeamMember(teamId: string, userId: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error removing team member:', error);
      return { data: false, error: 'Failed to remove team member' };
    }
  }

  // Get available users for team membership (users not in the team)
  async getAvailableUsers(teamId: string): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .not('id', 'in', `(SELECT user_id FROM team_members WHERE team_id = '${teamId}')`)
        .eq('is_active', true)
        .order('full_name');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching available users:', error);
      return { data: null, error: 'Failed to fetch available users' };
    }
  }

  // Get team stats
  async getTeamStats(): Promise<{ data: any | null; error: string | null }> {
    try {
      const [teamsResult, membersResult] = await Promise.all([
        this.supabase
          .from('teams')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
      ]);

      if (teamsResult.error) {
        return { data: null, error: teamsResult.error.message };
      }

      if (membersResult.error) {
        return { data: null, error: membersResult.error.message };
      }

      const stats = {
        total_teams: teamsResult.count || 0,
        total_memberships: membersResult.count || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching team stats:', error);
      return { data: null, error: 'Failed to fetch team stats' };
    }
  }
}

export const teamsService = new TeamsService();