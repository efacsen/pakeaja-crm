#!/usr/bin/env node

/**
 * Enhanced Environment Variable Checker
 * Checks required environment variables before build with comprehensive logging
 */

// Load environment variables from .env files
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development' });
require('dotenv').config({ path: '.env' });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_USE_SUPABASE',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Enhanced Vercel detection
const detectVercelEnvironment = () => {
  const indicators = {
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION,
    CI: process.env.CI,
    NODE_ENV: process.env.NODE_ENV
  };
  
  console.log('🔍 Environment Detection:');
  console.log('========================');
  Object.entries(indicators).forEach(([key, value]) => {
    console.log(`${key}: ${value || 'undefined'}`);
  });
  
  // Multiple ways to detect Vercel
  const isVercel = !!(
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_REGION
  );
  
  console.log(`\n📍 Detected Environment: ${isVercel ? 'Vercel' : 'Local/Other'}`);
  console.log(`📍 Vercel Environment: ${process.env.VERCEL_ENV || 'not set'}`);
  console.log(`📍 CI Environment: ${process.env.CI || 'not set'}`);
  
  return isVercel;
};

// Enhanced logging function
const logEnvironmentStatus = () => {
  console.log('\n🔍 Checking environment variables...');
  console.log('====================================');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🏗️  Build Context: ${process.env.CONTEXT || 'unknown'}`);
  console.log(`📦 Node Version: ${process.version}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'not set'}`);
  
  // Log all available environment variables (filtered for security)
  console.log('\n📝 Available Environment Variables:');
  const envVars = Object.keys(process.env).filter(key => 
    key.startsWith('NEXT_PUBLIC_') || 
    key.startsWith('VERCEL_') || 
    key.startsWith('CI') ||
    key.startsWith('NODE_')
  ).sort();
  
  envVars.forEach(key => {
    const value = process.env[key];
    // Hide sensitive values
    const displayValue = key.includes('KEY') || key.includes('SECRET') 
      ? value ? `${value.substring(0, 20)}...` : 'undefined'
      : value || 'undefined';
    console.log(`  ${key}: ${displayValue}`);
  });
};

// Main execution
console.log('🚀 Starting Environment Check...');
console.log('=================================\n');

// Log environment status
logEnvironmentStatus();

// Detect Vercel environment
const isVercel = detectVercelEnvironment();

// Check required variables
console.log('\n✅ Required Variables Check:');
console.log('============================');

let hasErrors = false;
const missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ Missing required: ${varName}`);
    hasErrors = true;
    missingVars.push(varName);
  } else {
    // Hide sensitive values in logs
    const displayValue = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 20)}...`
      : value;
    console.log(`✅ Found: ${varName} = ${displayValue}`);
  }
});

// Check optional variables
console.log('\n🔧 Optional Variables Check:');
console.log('============================');

optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  Missing optional: ${varName}`);
  } else {
    const displayValue = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 20)}...`
      : value;
    console.log(`✅ Found: ${varName} = ${displayValue}`);
  }
});

// Handle errors based on environment
if (hasErrors) {
  console.log('\n🚨 Environment Validation Results:');
  console.log('==================================');
  
  if (isVercel) {
    console.log('🌐 Detected Vercel Environment');
    console.log('⚠️  Missing environment variables in Vercel deployment');
    console.log('\n📋 Missing Variables:');
    missingVars.forEach(varName => {
      console.log(`  - ${varName}`);
    });
    
    console.log('\n🛠️  How to fix:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Navigate to Project Settings → Environment Variables');
    console.log('3. Add the missing variables for all environments');
    console.log('4. Redeploy your project');
    console.log('\n📖 Documentation: https://vercel.com/docs/environment-variables');
    
    // In Vercel, log the error but don't fail the build
    console.log('\n🔄 Continuing build in Vercel environment...');
    console.log('⚠️  App may have limited functionality without these variables');
    process.exit(0);
  } else {
    console.log('🏠 Detected Local/Other Environment');
    console.log('❌ Environment validation failed!');
    console.log('\n📋 Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`  - ${varName}`);
    });
    
    console.log('\n🛠️  To fix this:');
    console.log('1. Copy .env.example to .env.local');
    console.log('2. Fill in the required values');
    console.log('3. For CI/CD, add these as GitHub secrets');
    console.log('4. For Vercel, add these in project settings');
    console.log('\n📖 More info: https://supabase.com/dashboard/project/_/settings/api');
    
    process.exit(1);
  }
} else {
  console.log('\n🎉 Environment Check Passed!');
  console.log('============================');
  console.log('✅ All required environment variables are set!');
  console.log('🚀 Proceeding with build...\n');
}