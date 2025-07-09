#!/usr/bin/env node

// Script to verify Supabase storage bucket setup
// Run with: node scripts/verify-storage.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyStorage() {
  console.log('🔍 Verifying Supabase Storage Setup...\n');

  // Test 1: Try to list files in the bucket
  console.log('Test 1: Accessing canvassing-photos bucket...');
  try {
    const { data, error } = await supabase.storage
      .from('canvassing-photos')
      .list('', { limit: 1 });

    if (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.message.includes('not found')) {
        console.log('   → The bucket "canvassing-photos" does not exist');
        console.log('   → Please create it in Supabase Dashboard > Storage');
      }
    } else {
      console.log('✅ Successfully accessed canvassing-photos bucket!');
      console.log(`   → Can list files: ${data ? 'Yes' : 'No'}`);
    }
  } catch (e) {
    console.log(`❌ Exception: ${e.message}`);
  }

  // Test 2: Try to get public URL (works even without files)
  console.log('\nTest 2: Checking public URL generation...');
  try {
    const { data } = supabase.storage
      .from('canvassing-photos')
      .getPublicUrl('test.jpg');

    if (data && data.publicUrl) {
      console.log('✅ Public URL generation works!');
      console.log(`   → Example URL: ${data.publicUrl}`);
    } else {
      console.log('❌ Could not generate public URL');
    }
  } catch (e) {
    console.log(`❌ Exception: ${e.message}`);
  }

  console.log('\n📋 Summary:');
  console.log('- Supabase URL:', supabaseUrl);
  console.log('- Using anon key:', supabaseAnonKey ? 'Yes' : 'No');
  console.log('\nIf the tests failed, please:');
  console.log('1. Go to Supabase Dashboard > Storage');
  console.log('2. Create a bucket named "canvassing-photos"');
  console.log('3. Set it as a PUBLIC bucket');
  console.log('4. Run this script again');
}

verifyStorage().catch(console.error);