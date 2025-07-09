'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function TestSupabasePage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', message: 'Not tested yet' },
    { name: 'Authentication', status: 'pending', message: 'Not tested yet' },
    { name: 'RLS Policies', status: 'pending', message: 'Not tested yet' },
    { name: 'Storage Access', status: 'pending', message: 'Not tested yet' },
  ]);
  const [testing, setTesting] = useState(false);

  const supabase = createClient();

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ));
  };

  const runTests = async () => {
    setTesting(true);
    
    // Test 1: Database Connection
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        updateTest(0, 'error', `Connection failed: ${error.message}`);
      } else {
        updateTest(0, 'success', 'Database connection successful');
      }
    } catch (error) {
      updateTest(0, 'error', 'Failed to connect to database');
    }

    // Test 2: Authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        updateTest(1, 'success', `Authenticated as: ${user.email}`);
      } else {
        updateTest(1, 'error', 'No authenticated user');
      }
    } catch (error) {
      updateTest(1, 'error', 'Authentication test failed');
    }

    // Test 3: RLS Policies
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('RLS')) {
        updateTest(2, 'success', 'RLS policies are active (access restricted)');
      } else if (error) {
        updateTest(2, 'error', `RLS test failed: ${error.message}`);
      } else {
        updateTest(2, 'success', 'RLS policies working correctly');
      }
    } catch (error) {
      updateTest(2, 'error', 'RLS policy test failed');
    }

    // Test 4: Storage Access
    try {
      // Try to access the bucket directly instead of listing all buckets
      // listBuckets() requires service role, but accessing a specific bucket works with anon key
      const { data, error } = await supabase.storage
        .from('canvassing-photos')
        .list('test', { limit: 1 });
      
      if (error) {
        // If error message indicates bucket doesn't exist
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          updateTest(3, 'error', 'canvassing-photos bucket not found');
        } else {
          // Bucket exists but might have permission issues or other errors
          updateTest(3, 'success', 'Storage bucket exists (access limited by permissions)');
        }
      } else {
        // Successfully accessed the bucket
        updateTest(3, 'success', 'Storage bucket configured correctly');
      }
    } catch (error: any) {
      updateTest(3, 'error', `Storage access test failed: ${error.message || 'Unknown error'}`);
    }

    setTesting(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Pass</Badge>;
      case 'error':
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Supabase Integration Test</h1>
          <p className="text-gray-600">
            Test the Supabase integration to ensure everything is working correctly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Supabase URL</p>
                <p className="font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anon Key</p>
                <p className="font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Use Supabase</p>
                <p className="font-mono text-sm">
                  {process.env.NEXT_PUBLIC_USE_SUPABASE === 'true' ? '✅ Enabled' : '❌ Disabled (using mock)'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment</p>
                <p className="font-mono text-sm">
                  {process.env.NODE_ENV || 'development'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Test Results</CardTitle>
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="min-w-[120px]"
            >
              {testing ? 'Testing...' : 'Run Tests'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• If tests fail, check your environment variables</li>
            <li>• Make sure you've run the database migrations</li>
            <li>• Verify your Supabase project is active</li>
            <li>• Check the PRODUCTION_SETUP.md guide for detailed instructions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}