'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';

export default function AdminTestPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    status: string;
    role: string;
    email: string;
    permissions?: string[];
  } | null>(null);

  const runTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/admin/test');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Test failed');
      }
      
      setResults(data);
      
      if (data.isSuperadmin) {
        toast.success('You have superadmin access!');
      } else {
        toast.warning(`You are authenticated as: ${data.profile?.role || 'user'}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error(error instanceof Error ? error.message : 'Test failed');
      setResults({ error: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Admin Access Test
        </h1>
        <p className="text-muted-foreground">
          Test your admin privileges and API access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication & Authorization Test</CardTitle>
          <CardDescription>
            Click the button below to test your current access level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTest} 
            disabled={testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Test...
              </>
            ) : (
              'Run Access Test'
            )}
          </Button>

          {results && (
            <div className="mt-6 space-y-4">
              {/* Authentication Status */}
              <div className="flex items-center gap-2">
                {results.authenticated ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Authenticated</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Not Authenticated</span>
                  </>
                )}
              </div>

              {/* User Info */}
              {results.user && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">User Information</h3>
                  <p className="text-sm">ID: <code className="text-xs">{results.user.id}</code></p>
                  <p className="text-sm">Email: <code>{results.user.email}</code></p>
                </div>
              )}

              {/* Profile Info */}
              {results.profile && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">Profile Information</h3>
                  <p className="text-sm">Role: <code className="font-bold">{results.profile.role}</code></p>
                  <p className="text-sm">Name: <code>{results.profile.full_name || 'Not set'}</code></p>
                  {results.profile.organization_id && (
                    <p className="text-sm">Org ID: <code className="text-xs">{results.profile.organization_id}</code></p>
                  )}
                </div>
              )}

              {/* Superadmin Status */}
              <div className="flex items-center gap-2">
                {results.isSuperadmin ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Superadmin Access Confirmed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-orange-700">No Superadmin Access</span>
                  </>
                )}
              </div>

              {/* Admin API Test Results */}
              {results.adminTest && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">Admin API Test</h3>
                  {results.adminTest.success ? (
                    <>
                      <p className="text-sm text-green-600">✓ Admin API access working</p>
                      <p className="text-sm">Users found: {results.adminTest.userCount}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-red-600">✗ Admin API access failed</p>
                      <p className="text-sm">Error: {results.adminTest.error}</p>
                    </>
                  )}
                </div>
              )}

              {/* Error Display */}
              {results.error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{results.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Superadmin Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To upgrade a user to superadmin, you need to:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Access your Supabase dashboard</li>
            <li>Navigate to the SQL Editor</li>
            <li>Run this query (replace with your user ID):
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
{`UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id';`}
              </pre>
            </li>
            <li>Refresh this page and run the test again</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}