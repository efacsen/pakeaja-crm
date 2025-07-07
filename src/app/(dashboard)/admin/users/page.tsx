'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid static generation issues with auth context
export const dynamic = 'force-dynamic';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2, UserPlus, Search, Shield } from 'lucide-react';
import { UserRole } from '@/types/auth';

interface DatabaseUser {
  id: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at?: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form states for create/edit
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'sales_rep' as UserRole,
    password: '',
  });

  // Check if user is superadmin
  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      toast.error('Access denied. Superadmin only.');
      router.push('/dashboard');
    }
  }, [user, router]);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // First, get auth users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Auth error:', authError);
        // Fallback to direct table query
        const { data: dbUsers, error: dbError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (dbError) throw dbError;
        setUsers(dbUsers || []);
        return;
      }

      // Get user roles from users table
      const { data: userRoles, error: rolesError } = await supabase
        .from('users')
        .select('id, role, full_name');
        
      if (rolesError) throw rolesError;

      // Merge auth users with roles
      const mergedUsers = authData.users.map(authUser => {
        const userRole = userRoles?.find(r => r.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          full_name: userRole?.full_name || authUser.user_metadata?.full_name || 'Unknown',
          role: userRole?.role || 'sales_rep',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
        };
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin') {
      loadUsers();
    }
  }, [user]);

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create new user
  const handleCreateUser = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
        },
      });

      if (authError) throw authError;

      // Create user record
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: formData.full_name,
          role: formData.role,
        });

      if (dbError) throw dbError;

      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      setFormData({ email: '', full_name: '', role: 'sales_rep', password: '' });
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        {
          user_metadata: { full_name: formData.full_name },
        }
      );

      if (authError) throw authError;

      // Update role in users table
      const { error: dbError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          role: formData.role,
        })
        .eq('id', selectedUser.id);

      if (dbError) throw dbError;

      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(selectedUser.id);
      if (authError) throw authError;

      // Delete from users table (cascade should handle this, but just in case)
      await supabase.from('users').delete().eq('id', selectedUser.id);

      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // Open edit modal
  const openEditModal = (user: DatabaseUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role,
      password: '',
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (user: DatabaseUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      superadmin: 'bg-red-500',
      admin: 'bg-orange-500',
      project_manager: 'bg-blue-500',
      sales_rep: 'bg-green-500',
      estimator: 'bg-purple-500',
      foreman: 'bg-yellow-500',
      customer: 'bg-gray-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                        disabled={user.id === supabase.auth.user()?.id}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openDeleteModal(user)}
                        disabled={user.id === supabase.auth.user()?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with specific role and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <div>
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="sales_rep">Sales Rep</SelectItem>
                  <SelectItem value="estimator">Estimator</SelectItem>
                  <SelectItem value="foreman">Foreman</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="sales_rep">Sales Rep</SelectItem>
                  <SelectItem value="estimator">Estimator</SelectItem>
                  <SelectItem value="foreman">Foreman</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                User: <span className="font-medium text-foreground">{selectedUser.full_name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium text-foreground">{selectedUser.email}</span>
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}