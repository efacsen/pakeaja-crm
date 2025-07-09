'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DiagnosticsData {
  timestamp?: string;
  environment?: {
    nodeEnv?: string;
    hasServiceRoleKey?: boolean;
    hasAnonKey?: boolean;
    hasSupabaseUrl?: boolean;
  };
  auth?: {
    user?: { id: string; email?: string } | null;
    session?: { expires_at?: number } | null;
    error?: string | null;
  };
  profile?: {
    viaAnon?: Record<string, unknown> | null;
    viaServiceRole?: Record<string, unknown> | null;
    error?: string | null;
    anonError?: string;
    serviceRoleError?: string;
  };
  database?: {
    canConnectAnon?: boolean;
    canConnectServiceRole?: boolean;
    profileCount?: number;
  };
  diagnosis?: {
    issues: string[];
    recommendations: string[];
    summary: string;
  };
  error?: string;
}

export default function DebugAuthPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const fetchDiagnostics = async () => {
    try {
      const response = await fetch('/api/debug-auth');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      setDiagnostics({ error: 'Failed to fetch diagnostics' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading diagnostics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Auth Debug Information</h1>
        
        {/* Quick Actions */}
        <div className="mb-8 space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Go to Login
          </button>
          <button
            onClick={fetchDiagnostics}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>

        {/* Diagnosis Summary */}
        {diagnostics?.diagnosis && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📊 Diagnosis Summary</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-red-400 mb-2">Issues Found:</h3>
              <ul className="list-disc list-inside space-y-1">
                {diagnostics.diagnosis.issues.map((issue: string, i: number) => (
                  <li key={i} className={issue.includes('SUCCESS') ? 'text-green-400' : 'text-red-300'}>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1">
                {diagnostics.diagnosis.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-yellow-300">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Environment Variables */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔧 Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(diagnostics?.environment || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span className={value ? 'text-green-400' : 'text-red-400'}>
                  {value ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication Status */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔐 Authentication Status</h2>
          {diagnostics?.auth?.user ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ User authenticated</p>
              <p className="text-gray-400">ID: {diagnostics.auth.user.id}</p>
              <p className="text-gray-400">Email: {diagnostics.auth.user.email}</p>
            </div>
          ) : (
            <p className="text-red-400">❌ No authenticated user</p>
          )}
          {diagnostics?.auth?.error && (
            <p className="text-red-400 mt-2">Error: {diagnostics.auth.error}</p>
          )}
        </div>

        {/* Profile Access */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">👤 Profile Access</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Via Anon Key (RLS Applied):</h3>
            {diagnostics?.profile?.viaAnon ? (
              <pre className="bg-gray-900 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(diagnostics.profile.viaAnon, null, 2)}
              </pre>
            ) : (
              <p className="text-red-400">
                ❌ Cannot access profile
                {diagnostics?.profile?.anonError && (
                  <span className="block text-sm mt-1">Error: {diagnostics.profile.anonError}</span>
                )}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Via Service Role (No RLS):</h3>
            {diagnostics?.profile?.viaServiceRole ? (
              <pre className="bg-gray-900 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(diagnostics.profile.viaServiceRole, null, 2)}
              </pre>
            ) : (
              <p className="text-red-400">
                ❌ Cannot access profile even with service role
                {diagnostics?.profile?.serviceRoleError && (
                  <span className="block text-sm mt-1">Error: {diagnostics.profile.serviceRoleError}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Database Connection */}
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🗄️ Database Connection</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Anon Key Connection:</span>
              <span className={diagnostics?.database?.canConnectAnon ? 'text-green-400' : 'text-red-400'}>
                {diagnostics?.database?.canConnectAnon ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Role Connection:</span>
              <span className={diagnostics?.database?.canConnectServiceRole ? 'text-green-400' : 'text-red-400'}>
                {diagnostics?.database?.canConnectServiceRole ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            {diagnostics?.database?.profileCount !== undefined && (
              <div className="flex justify-between">
                <span>Total Profiles in Database:</span>
                <span className="text-blue-400">{diagnostics.database.profileCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Raw Data */}
        <details className="mb-8">
          <summary className="cursor-pointer text-gray-400 hover:text-white">
            View Raw Diagnostic Data
          </summary>
          <pre className="mt-4 p-4 bg-gray-800 rounded overflow-auto text-sm">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}