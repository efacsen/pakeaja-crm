import { createClient } from '@/lib/supabase/client';
import { 
  Territory, 
  TerritoryWithDetails, 
  UserTerritoryAssignment, 
  UserTerritoryAssignmentWithDetails, 
  CreateTerritoryRequest, 
  UpdateTerritoryRequest, 
  TerritoryFilters, 
  TerritoryHierarchy,
  AssignTerritoryRequest,
  TerritoryStats
} from '@/types/territories';

export class TerritoriesService {
  private supabase = createClient();

  // Get all territories for the current organization
  async getTerritories(filters?: TerritoryFilters): Promise<{ data: TerritoryWithDetails[] | null; error: string | null }> {
    try {
      let query = this.supabase
        .from('territories')
        .select(`
          *,
          parent_territory:territories!parent_territory_id(name)
        `)
        .order('name');

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
      }

      if (filters?.parent_territory_id) {
        query = query.eq('parent_territory_id', filters.parent_territory_id);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Get user counts for each territory
      const territoriesWithCounts = await Promise.all(
        (data || []).map(async (territory) => {
          const { count } = await this.supabase
            .from('user_territories')
            .select('*', { count: 'exact', head: true })
            .eq('territory_id', territory.id);

          return {
            ...territory,
            parent_territory_name: territory.parent_territory?.name,
            user_count: count || 0,
          };
        })
      );

      return { data: territoriesWithCounts, error: null };
    } catch (error) {
      console.error('Error fetching territories:', error);
      return { data: null, error: 'Failed to fetch territories' };
    }
  }

  // Get territory hierarchy
  async getTerritoryHierarchy(): Promise<{ data: TerritoryHierarchy[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('territories')
        .select(`
          *,
          parent_territory:territories!parent_territory_id(name)
        `)
        .order('name');

      if (error) {
        return { data: null, error: error.message };
      }

      // Build hierarchy structure
      const hierarchy = this.buildTerritoryHierarchy(data || []);
      return { data: hierarchy, error: null };
    } catch (error) {
      console.error('Error fetching territory hierarchy:', error);
      return { data: null, error: 'Failed to fetch territory hierarchy' };
    }
  }

  // Build hierarchical structure from flat data
  private buildTerritoryHierarchy(territories: any[]): TerritoryHierarchy[] {
    const territoryMap = new Map<string, TerritoryHierarchy>();
    const rootTerritories: TerritoryHierarchy[] = [];

    // Create map and initialize children arrays
    territories.forEach(territory => {
      territoryMap.set(territory.id, { 
        ...territory, 
        parent_territory_name: territory.parent_territory?.name,
        children: [] 
      });
    });

    // Build hierarchy
    territories.forEach(territory => {
      const territoryNode = territoryMap.get(territory.id)!;
      if (territory.parent_territory_id) {
        const parent = territoryMap.get(territory.parent_territory_id);
        if (parent) {
          parent.children!.push(territoryNode);
        }
      } else {
        rootTerritories.push(territoryNode);
      }
    });

    return rootTerritories;
  }

  // Get single territory by ID
  async getTerritory(id: string): Promise<{ data: TerritoryWithDetails | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('territories')
        .select(`
          *,
          parent_territory:territories!parent_territory_id(name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Get territory assignments
      const { data: assignments } = await this.supabase
        .from('user_territory_assignments')
        .select('*')
        .eq('territory_id', id);

      return { 
        data: {
          ...data,
          parent_territory_name: data.parent_territory?.name,
          assigned_users: assignments || [],
          user_count: assignments?.length || 0,
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching territory:', error);
      return { data: null, error: 'Failed to fetch territory' };
    }
  }

  // Create new territory
  async createTerritory(territoryData: CreateTerritoryRequest): Promise<{ data: Territory | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('territories')
        .insert([territoryData])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating territory:', error);
      return { data: null, error: 'Failed to create territory' };
    }
  }

  // Update territory
  async updateTerritory(id: string, territoryData: UpdateTerritoryRequest): Promise<{ data: Territory | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('territories')
        .update({ ...territoryData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating territory:', error);
      return { data: null, error: 'Failed to update territory' };
    }
  }

  // Delete territory
  async deleteTerritory(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('territories')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error deleting territory:', error);
      return { data: false, error: 'Failed to delete territory' };
    }
  }

  // Get territory assignments
  async getTerritoryAssignments(territoryId: string): Promise<{ data: UserTerritoryAssignmentWithDetails[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_territory_assignments')
        .select('*')
        .eq('territory_id', territoryId)
        .order('assigned_at');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching territory assignments:', error);
      return { data: null, error: 'Failed to fetch territory assignments' };
    }
  }

  // Assign territory to user
  async assignTerritory(assignmentData: AssignTerritoryRequest): Promise<{ data: UserTerritoryAssignment | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_territories')
        .insert([{
          ...assignmentData,
          is_primary: assignmentData.is_primary || false,
        }])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error assigning territory:', error);
      return { data: null, error: 'Failed to assign territory' };
    }
  }

  // Update territory assignment
  async updateTerritoryAssignment(
    userId: string, 
    territoryId: string, 
    updates: { is_primary?: boolean }
  ): Promise<{ data: UserTerritoryAssignment | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_territories')
        .update(updates)
        .eq('user_id', userId)
        .eq('territory_id', territoryId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating territory assignment:', error);
      return { data: null, error: 'Failed to update territory assignment' };
    }
  }

  // Remove territory assignment
  async removeTerritoryAssignment(userId: string, territoryId: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('user_territories')
        .delete()
        .eq('user_id', userId)
        .eq('territory_id', territoryId);

      if (error) {
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Error removing territory assignment:', error);
      return { data: false, error: 'Failed to remove territory assignment' };
    }
  }

  // Get user's territories
  async getUserTerritories(userId: string): Promise<{ data: UserTerritoryAssignmentWithDetails[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('user_territory_assignments')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user territories:', error);
      return { data: null, error: 'Failed to fetch user territories' };
    }
  }

  // Get available users for territory assignment (users not in the territory)
  async getAvailableUsers(territoryId: string): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .not('id', 'in', `(SELECT user_id FROM user_territories WHERE territory_id = '${territoryId}')`)
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

  // Get territory stats
  async getTerritoryStats(): Promise<{ data: TerritoryStats | null; error: string | null }> {
    try {
      const [territoriesResult, assignmentsResult, primaryAssignmentsResult] = await Promise.all([
        this.supabase
          .from('territories')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('user_territories')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('user_territories')
          .select('*', { count: 'exact', head: true })
          .eq('is_primary', true)
      ]);

      if (territoriesResult.error) {
        return { data: null, error: territoriesResult.error.message };
      }

      if (assignmentsResult.error) {
        return { data: null, error: assignmentsResult.error.message };
      }

      if (primaryAssignmentsResult.error) {
        return { data: null, error: primaryAssignmentsResult.error.message };
      }

      // Get unique users with territories
      const { data: usersWithTerritories } = await this.supabase
        .from('user_territories')
        .select('user_id', { count: 'exact' });

      const uniqueUsers = new Set((usersWithTerritories || []).map(u => u.user_id));

      const stats: TerritoryStats = {
        total_territories: territoriesResult.count || 0,
        total_assignments: assignmentsResult.count || 0,
        users_with_territories: uniqueUsers.size,
        users_without_territories: 0, // Would need to query profiles to get this
        primary_assignments: primaryAssignmentsResult.count || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching territory stats:', error);
      return { data: null, error: 'Failed to fetch territory stats' };
    }
  }
}

export const territoriesService = new TerritoriesService();