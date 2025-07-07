import { createClient } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  last_login?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  old_data?: any;
  new_data?: any;
  changed_by: string;
  changed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export const adminService = {
  // User Management
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: 'active' | 'inactive' | 'deleted';
  }): Promise<AdminUser[]> {
    const supabase = createClient();
    
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    if (filters?.status) {
      if (filters.status === 'deleted') {
        query = query.not('deleted_at', 'is', null);
      } else {
        query = query.is('deleted_at', null).eq('status', filters.status);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data || [];
  },

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role: string;
  }): Promise<AdminUser> {
    const supabase = createClient();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    // Create user record
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user record:', error);
      // Try to delete auth user if record creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    // Log the action
    await this.logAction('users', data.id, 'CREATE', null, data);

    return data;
  },

  async updateUser(userId: string, updates: {
    name?: string;
    role?: string;
    status?: 'active' | 'inactive';
  }): Promise<AdminUser> {
    const supabase = createClient();
    
    // Get old data for audit
    const { data: oldData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    // Log the action
    await this.logAction('users', userId, 'UPDATE', oldData, data);

    return data;
  },

  async deleteUser(userId: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get old data for audit
    const { data: oldData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Soft delete
    const { error } = await supabase
      .from('users')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id
      })
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    // Log the action
    await this.logAction('users', userId, 'DELETE', oldData, { deleted: true });
  },

  async restoreUser(userId: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        status: 'active',
        deleted_at: null,
        deleted_by: null
      })
      .eq('id', userId);

    if (error) {
      console.error('Error restoring user:', error);
      throw error;
    }

    // Log the action
    await this.logAction('users', userId, 'UPDATE', { deleted: true }, { restored: true });
  },

  async resetUserPassword(userId: string): Promise<string> {
    const supabase = createClient();
    
    // Generate new password
    const newPassword = nanoid(12);
    
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }

    // Log the action
    await this.logAction('users', userId, 'UPDATE', null, { password_reset: true });

    return newPassword;
  },

  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('users')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id
      })
      .in('id', userIds);

    if (error) {
      console.error('Error bulk deleting users:', error);
      throw error;
    }

    // Log the action
    for (const userId of userIds) {
      await this.logAction('users', userId, 'DELETE', null, { bulk_delete: true });
    }
  },

  // Audit Logging
  async logAction(
    tableName: string,
    recordId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    oldData?: any,
    newData?: any
  ): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get user's IP and user agent (would need to pass from client)
    const ipAddress = null; // Would need to get from request headers
    const userAgent = null; // Would need to get from request headers
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        table_name: tableName,
        record_id: recordId,
        action: action,
        old_data: oldData,
        new_data: newData,
        changed_by: user?.id,
        changed_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (error) {
      console.error('Error logging action:', error);
      // Don't throw - audit logging should not break main operations
    }
  },

  async getAuditLogs(filters?: {
    table_name?: string;
    record_id?: string;
    changed_by?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<AuditLog[]> {
    const supabase = createClient();
    
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:changed_by (
          name,
          email
        )
      `)
      .order('changed_at', { ascending: false });

    if (filters?.table_name) {
      query = query.eq('table_name', filters.table_name);
    }

    if (filters?.record_id) {
      query = query.eq('record_id', filters.record_id);
    }

    if (filters?.changed_by) {
      query = query.eq('changed_by', filters.changed_by);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.date_from) {
      query = query.gte('changed_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('changed_at', filters.date_to);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }

    return data || [];
  },

  async rollbackChange(auditLogId: string): Promise<void> {
    const supabase = createClient();
    
    // Get the audit log entry
    const { data: log, error: logError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', auditLogId)
      .single();

    if (logError || !log) {
      throw new Error('Audit log not found');
    }

    // Perform rollback based on action type
    if (log.action === 'DELETE' && log.old_data) {
      // Restore deleted record
      const { error } = await supabase
        .from(log.table_name)
        .insert(log.old_data);

      if (error) throw error;
    } else if (log.action === 'UPDATE' && log.old_data) {
      // Revert to old data
      const { error } = await supabase
        .from(log.table_name)
        .update(log.old_data)
        .eq('id', log.record_id);

      if (error) throw error;
    } else if (log.action === 'CREATE') {
      // Delete created record
      const { error } = await supabase
        .from(log.table_name)
        .delete()
        .eq('id', log.record_id);

      if (error) throw error;
    }

    // Log the rollback action
    await this.logAction(
      log.table_name,
      log.record_id,
      'UPDATE',
      log.new_data,
      { rollback_from: auditLogId, ...log.old_data }
    );
  },

  // Generic Table Management
  async getTableData(tableName: string, filters?: any): Promise<any[]> {
    const supabase = createClient();
    
    let query = supabase.from(tableName).select('*');

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    return data || [];
  },

  async createRecord(tableName: string, data: any): Promise<any> {
    const supabase = createClient();
    
    const { data: created, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${tableName} record:`, error);
      throw error;
    }

    await this.logAction(tableName, created.id, 'CREATE', null, created);
    return created;
  },

  async updateRecord(tableName: string, id: string, updates: any): Promise<any> {
    const supabase = createClient();
    
    // Get old data
    const { data: oldData } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    const { data: updated, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${tableName} record:`, error);
      throw error;
    }

    await this.logAction(tableName, id, 'UPDATE', oldData, updated);
    return updated;
  },

  async deleteRecord(tableName: string, id: string, hardDelete: boolean = false): Promise<void> {
    const supabase = createClient();
    
    // Get old data
    const { data: oldData } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (hardDelete) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } else {
      // Soft delete
      const { error } = await supabase
        .from(tableName)
        .update({
          deleted_at: new Date().toISOString(),
          status: 'deleted'
        })
        .eq('id', id);

      if (error) throw error;
    }

    await this.logAction(tableName, id, 'DELETE', oldData, null);
  }
};