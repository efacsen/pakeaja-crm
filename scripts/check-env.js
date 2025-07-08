#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Checks required environment variables before build
 */

// Skip validation in Vercel if environment variables are not set
// This allows Vercel to build with its own environment configuration
// Vercel sets VERCEL_ENV to 'production', 'preview', or 'development'
const isVercel = process.env.VERCEL_ENV !== undefined;

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_USE_SUPABASE',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('🔍 Checking environment variables...\n');

if (isVercel) {
  console.log('📦 Running in Vercel environment');
  console.log('⚠️  Skipping strict validation - Vercel will use its own environment variables\n');
}

let hasErrors = false;
const missingVars = [];

// Check required variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required: ${varName}`);
    missingVars.push(varName);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${varName}`);
  }
});

console.log('\nOptional variables:');
// Check optional variables
optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`⚠️  Missing optional: ${varName}`);
  } else {
    console.log(`✅ Found: ${varName}`);
  }
});

if (hasErrors && !isVercel) {
  console.error('\n❌ Environment validation failed!');
  console.error('\nMissing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  
  console.error('\n📝 To fix this:');
  console.error('1. Copy .env.example to .env.local');
  console.error('2. Fill in the required values');
  console.error('3. For CI/CD, add these as GitHub secrets');
  console.error('4. For Vercel, add these in project settings');
  console.error('\nFor more info: https://supabase.com/dashboard/project/_/settings/api');
  
  process.exit(1);
} else if (hasErrors && isVercel) {
  console.warn('\n⚠️  Some environment variables are missing in Vercel');
  console.warn('Make sure to configure them in your Vercel project settings:');
  console.warn('https://vercel.com/dashboard/project/settings/environment-variables\n');
  // Don't exit with error in Vercel - let it continue with build
  process.exit(0);
} else {
  console.log('\n✅ All required environment variables are set!');
  
  // Additional validation for Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.warn('\n⚠️  Warning: NEXT_PUBLIC_SUPABASE_URL doesn\'t look like a Supabase URL');
    console.warn('   Expected format: https://[project-id].supabase.co');
  }
  
  process.exit(0);
}