'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft, AlertCircle } from 'lucide-react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
              <ShieldX className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Access Denied</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            This page requires specific permissions that your current role doesn't have. 
            If you believe you should have access to this page, please contact your administrator.
          </p>

          {reason && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  {reason === 'no-profile' && (
                    <>
                      <p className="font-semibold">Profile not found</p>
                      <p className="mt-1">Your user profile hasn't been created yet. This usually happens on first login.</p>
                      <Link href="/api/profile-check" className="underline hover:no-underline mt-2 inline-block">
                        Check profile status →
                      </Link>
                    </>
                  )}
                  {reason === 'inactive' && (
                    <>
                      <p className="font-semibold">Account inactive</p>
                      <p className="mt-1">Your account has been deactivated. Please contact an administrator.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Error Code: 403 - Forbidden
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}