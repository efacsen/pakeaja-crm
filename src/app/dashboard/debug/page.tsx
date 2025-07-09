'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardDebugPage() {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            setError(error.message);
          } else {
            setProfileData(data);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    };

    fetchProfile();
  }, [user, supabase]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Debug Information</h1>
      
      <div className="space-y-6">
        {/* Loading State */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Loading State</h2>
          <p>Auth Loading: {loading ? '✅ Yes' : '❌ No'}</p>
        </div>

        {/* User Context Data */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">User Context Data</h2>
          {user ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-red-500">No user data in context</p>
          )}
        </div>

        {/* Direct Profile Query */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Direct Profile Query</h2>
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : profileData ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          ) : (
            <p>Loading profile data...</p>
          )}
        </div>

        {/* Critical Fields Check */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Critical Fields Check</h2>
          <ul className="space-y-1">
            <li>user.id: {user?.id ? '✅' : '❌'} {user?.id || 'Missing'}</li>
            <li>user.email: {user?.email ? '✅' : '❌'} {user?.email || 'Missing'}</li>
            <li>user.role: {user?.role ? '✅' : '❌'} {user?.role || 'Missing'}</li>
            <li>user.organization_id: {user?.organization_id ? '✅' : '❌'} {user?.organization_id || 'Missing'}</li>
            <li>user.full_name: {user?.full_name ? '✅' : '❌'} {user?.full_name || 'Missing'}</li>
          </ul>
        </div>

        {/* Environment Check */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Environment</h2>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}