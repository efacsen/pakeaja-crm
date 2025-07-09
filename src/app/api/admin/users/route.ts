import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient, isAdminClientAvailable } from '@/lib/supabase/admin';
import { checkSuperadminAccess } from '@/lib/auth/admin-check';
import { z } from 'zod';

// Schema for creating a user
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().optional(),
  role: z.enum(['admin', 'sales', 'manager', 'estimator', 'project_manager', 'foreman', 'inspector', 'client']),
});

// Schema for updating a user
const updateUserSchema = z.object({
  full_name: z.string().optional(),
  role: z.enum(['admin', 'sales', 'manager', 'estimator', 'project_manager', 'foreman', 'inspector', 'client']).optional(),
  email: z.string().email().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build time (no environment variables available)
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not available - missing environment variables' 
      }, { status: 503 });
    }

    // Check superadmin access
    const accessCheck = await checkSuperadminAccess();
    if (!accessCheck.authorized) {
      return accessCheck.response;
    }

    const supabase = await createClient();

    // Fetch all users with their profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Get auth users to get email addresses using admin client
    const adminClient = getAdminClient();
    const { data: authUsers, error: authUsersError } = await adminClient.auth.admin.listUsers();

    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError);
      // Return profiles without emails if we can't get auth users
      return NextResponse.json({ users: profiles }, { status: 200 });
    }

    // Merge auth user data with profiles
    const usersWithEmail = profiles.map(profile => {
      const authUser = authUsers.users.find(u => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || '',
        email_confirmed_at: authUser?.email_confirmed_at,
        last_sign_in_at: authUser?.last_sign_in_at,
      };
    });

    return NextResponse.json({ users: usersWithEmail }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build time (no environment variables available)
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not available - missing environment variables' 
      }, { status: 503 });
    }

    // Check superadmin access
    const accessCheck = await checkSuperadminAccess();
    if (!accessCheck.authorized) {
      return accessCheck.response;
    }

    const supabase = await createClient();

    // Parse request body
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Create user in auth.users using admin client
    const adminClient = getAdminClient();
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        full_name: validatedData.full_name || '',
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    if (!newUser.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Update the user's profile with role and full name
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: validatedData.role,
        full_name: validatedData.full_name || '',
      })
      .eq('id', newUser.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Try to delete the user if profile update fails
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role: validatedData.role,
        full_name: validatedData.full_name || '',
        created_at: newUser.user.created_at,
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if we're in build time (no environment variables available)
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not available - missing environment variables' 
      }, { status: 503 });
    }

    // Check superadmin access
    const accessCheck = await checkSuperadminAccess();
    if (!accessCheck.authorized) {
      return accessCheck.response;
    }

    const supabase = await createClient();

    // Get user ID from URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Update profile
    const updateData: any = {};
    if (validatedData.full_name !== undefined) updateData.full_name = validatedData.full_name;
    if (validatedData.role !== undefined) updateData.role = validatedData.role;

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    // Update email if provided
    if (validatedData.email) {
      const adminClient = getAdminClient();
      const { error: emailError } = await adminClient.auth.admin.updateUserById(
        userId,
        { email: validatedData.email }
      );

      if (emailError) {
        console.error('Error updating email:', emailError);
        return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error in PATCH /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if we're in build time (no environment variables available)
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not available - missing environment variables' 
      }, { status: 503 });
    }

    // Check superadmin access
    const accessCheck = await checkSuperadminAccess();
    if (!accessCheck.authorized) {
      return accessCheck.response;
    }

    const supabase = await createClient();

    // Get user ID from URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === accessCheck.user!.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user from auth.users (this will cascade delete from profiles)
    const adminClient = getAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}