#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Checks required environment variables before build
 */

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

if (hasErrors) {
  console.error('\n❌ Environment validation failed!');
  console.error('\nMissing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  
  console.error('\n📝 To fix this:');
  console.error('1. Copy .env.example to .env.local');
  console.error('2. Fill in the required values');
  console.error('3. For CI/CD, add these as GitHub secrets');
  console.error('\nFor more info: https://supabase.com/dashboard/project/_/settings/api');
  
  process.exit(1);
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