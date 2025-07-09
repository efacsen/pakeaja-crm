'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestStoragePage() {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const supabase = createClient();

  const runStorageTests = async () => {
    setTesting(true);
    setResults([]);
    const logs: string[] = [];

    // Test 1: Check if we can list buckets
    logs.push('=== Test 1: List Buckets ===');
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        logs.push(`❌ Error listing buckets: ${error.message}`);
        logs.push(`Error code: ${(error as any).code || 'N/A'}`);
        logs.push(`Error details: ${JSON.stringify(error)}`);
      } else {
        logs.push(`✅ Successfully listed buckets`);
        logs.push(`Found ${buckets?.length || 0} buckets:`);
        buckets?.forEach(bucket => {
          logs.push(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
      }
    } catch (e: any) {
      logs.push(`❌ Exception: ${e.message}`);
    }

    // Test 2: Try to access the bucket directly
    logs.push('\n=== Test 2: Direct Bucket Access ===');
    try {
      const { data: files, error } = await supabase.storage
        .from('canvassing-photos')
        .list('', { limit: 1 });
      
      if (error) {
        logs.push(`❌ Error accessing bucket: ${error.message}`);
        logs.push(`Error details: ${JSON.stringify(error)}`);
      } else {
        logs.push(`✅ Successfully accessed canvassing-photos bucket`);
        logs.push(`Can list files: ${files ? 'Yes' : 'No'}`);
      }
    } catch (e: any) {
      logs.push(`❌ Exception: ${e.message}`);
    }

    // Test 3: Get current user info
    logs.push('\n=== Test 3: User Authentication ===');
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        logs.push(`❌ Auth error: ${error.message}`);
      } else if (user) {
        logs.push(`✅ Authenticated as: ${user.email}`);
        logs.push(`User ID: ${user.id}`);
        logs.push(`Role: ${user.role}`);
      } else {
        logs.push('❌ No authenticated user');
      }
    } catch (e: any) {
      logs.push(`❌ Exception: ${e.message}`);
    }

    // Test 4: Check Supabase configuration
    logs.push('\n=== Test 4: Configuration ===');
    logs.push(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    logs.push(`Has Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}`);
    logs.push(`Use Supabase: ${process.env.NEXT_PUBLIC_USE_SUPABASE}`);

    setResults(logs);
    setTesting(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Storage Debug Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runStorageTests} 
            disabled={testing}
            className="mb-4"
          >
            {testing ? 'Testing...' : 'Run Storage Tests'}
          </Button>
          
          {results.length > 0 && (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              {results.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}