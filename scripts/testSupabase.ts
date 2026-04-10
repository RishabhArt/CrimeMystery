/**
 * Supabase Connection & Database Testing Script
 * 
 * This script tests:
 * - Supabase connection
 * - Authentication flow
 * - Database CRUD operations
 * - RLS (Row Level Security) policies
 * 
 * Run with: npx ts-node scripts/testSupabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create clients
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const testEmail = `testuser${Date.now()}@gmail.com`;
const testPassword = 'TestPassword123!';
const testDisplayName = 'Test Detective';

let testUserId: string;
let testAuthId: string;

/**
 * Test 1: Check Supabase Connection
 */
const testConnection = async () => {
  console.log('\n📡 Test 1: Checking Supabase Connection...');
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
};

/**
 * Test 2: User Authentication (Sign Up)
 */
const testSignUp = async () => {
  console.log('\n📝 Test 2: Testing User Sign Up...');
  try {
    const { data, error } = await supabaseAnon.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation returned no user');

    testAuthId = data.user.id;
    console.log(`✅ User sign up successful (ID: ${testAuthId})`);
    
    // Auto-confirm email for testing
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      testAuthId,
      { email_confirm: true }
    );
    
    if (confirmError) {
      console.log('⚠️ Warning: Could not auto-confirm email');
    } else {
      console.log('✅ Email auto-confirmed for testing');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Sign up failed:', error.message);
    return false;
  }
};

/**
 * Test 3: User Profile Creation
 */
const testProfileCreation = async () => {
  console.log('\n👤 Test 3: Testing User Profile Creation...');
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          auth_id: testAuthId,
          email: testEmail,
          display_name: testDisplayName,
          level: 1,
          total_xp: 0,
          total_clues_owned: 0,
          free_clues_remaining: 3,
          last_clue_reset: new Date().toISOString(),
          total_spent_amount: 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    testUserId = data.id;
    console.log(`✅ User profile created (ID: ${testUserId})`);
    return true;
  } catch (error: any) {
    console.error('❌ Profile creation failed:', error.message);
    return false;
  }
};

/**
 * Test 4: User Sign In
 */
const testSignIn = async () => {
  console.log('\n🔐 Test 4: Testing User Sign In...');
  try {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session returned');

    console.log(`✅ User sign in successful`);
    console.log(`   - Access Token: ${data.session.access_token.substring(0, 20)}...`);
    console.log(`   - User ID: ${data.user?.id}`);
    return true;
  } catch (error: any) {
    console.error('❌ Sign in failed:', error.message);
    return false;
  }
};

/**
 * Test 5: Read User Profile
 */
const testReadProfile = async () => {
  console.log('\n📖 Test 5: Testing Read User Profile...');
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (error) throw error;
    console.log('✅ User profile read successful');
    console.log(`   - Name: ${data.display_name}`);
    console.log(`   - Email: ${data.email}`);
    console.log(`   - Level: ${data.level}`);
    console.log(`   - XP: ${data.total_xp}`);
    return true;
  } catch (error: any) {
    console.error('❌ Read profile failed:', error.message);
    return false;
  }
};

/**
 * Test 6: Update User Profile
 */
const testUpdateProfile = async () => {
  console.log('\n✏️ Test 6: Testing Update User Profile...');
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        total_xp: 500,
        level: 2,
        updated_at: new Date().toISOString(),
      })
      .eq('id', testUserId)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ User profile updated successfully');
    console.log(`   - New XP: ${data.total_xp}`);
    console.log(`   - New Level: ${data.level}`);
    return true;
  } catch (error: any) {
    console.error('❌ Update profile failed:', error.message);
    return false;
  }
};

/**
 * Test 7: Fetch Cases
 */
const testFetchCases = async () => {
  console.log('\n📋 Test 7: Testing Fetch Cases...');
  try {
    const { data, error } = await supabaseAnon
      .from('cases')
      .select('id, title, difficulty')
      .eq('is_published', true)
      .limit(5);

    if (error) throw error;
    console.log(`✅ Cases fetched successfully (${data.length} cases found)`);
    if (data.length > 0) {
      data.forEach((caseItem: any) => {
        console.log(`   - ${caseItem.title} (${caseItem.difficulty})`);
      });
    }
    return true;
  } catch (error: any) {
    console.error('❌ Fetch cases failed:', error.message);
    return false;
  }
};

/**
 * Test 8: Storage Operations
 */
const testStorage = async () => {
  console.log('\n💾 Test 8: Testing Storage Operations...');
  try {
    // Test file upload (dummy content)
    const fileName = `test_${Date.now()}.txt`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('case-images')
      .upload(fileName, new TextEncoder().encode('test content'), {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadError) throw uploadError;
    console.log(`✅ File uploaded successfully: ${fileName}`);

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('case-images')
      .getPublicUrl(fileName);

    console.log(`✅ Public URL: ${urlData.publicUrl}`);

    // Delete test file
    const { error: deleteError } = await supabaseAdmin.storage
      .from('case-images')
      .remove([fileName]);

    if (deleteError) throw deleteError;
    console.log(`✅ File deleted successfully`);

    return true;
  } catch (error: any) {
    console.error('❌ Storage test failed:', error.message);
    return false;
  }
};

/**
 * Test 9: RLS Policies
 */
const testRLS = async () => {
  console.log('\n🔒 Test 9: Testing RLS Policies...');
  try {
    // Try to read own profile with anon client
    const { data: ownData, error: ownError } = await supabaseAnon
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (ownError) {
      console.log('✅ RLS correctly prevents anonymous access to user profiles');
    } else {
      console.log('⚠️ Warning: RLS may not be properly configured');
    }

    // Admin should be able to read
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (!adminError && adminData) {
      console.log('✅ Admin client can access user data');
    }

    return true;
  } catch (error: any) {
    console.error('❌ RLS test failed:', error.message);
    return false;
  }
};

/**
 * Test 10: Cleanup
 */
const testCleanup = async () => {
  console.log('\n🧹 Test 10: Cleaning Up Test Data...');
  try {
    // Delete user profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', testUserId);

    if (profileError) throw profileError;
    console.log('✅ Test user profile deleted');

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      testAuthId
    );

    if (authError) throw authError;
    console.log('✅ Test auth user deleted');

    return true;
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    return false;
  }
};

/**
 * Run all tests
 */
const runAllTests = async () => {
  console.log('═'.repeat(60));
  console.log('🧪 SUPABASE TESTING SUITE');
  console.log('═'.repeat(60));

  const results: { [key: string]: boolean } = {};

  // Run tests sequentially
  results['Connection'] = await testConnection();
  if (!results['Connection']) {
    console.error('\n❌ Cannot proceed without connection. Exiting.');
    process.exit(1);
  }

  results['Sign Up'] = await testSignUp();
  if (!results['Sign Up']) {
    console.error('\n❌ Cannot proceed without successful sign up. Exiting.');
    process.exit(1);
  }

  results['Profile Creation'] = await testProfileCreation();
  results['Sign In'] = await testSignIn();
  results['Read Profile'] = await testReadProfile();
  results['Update Profile'] = await testUpdateProfile();
  results['Fetch Cases'] = await testFetchCases();
  results['Storage'] = await testStorage();
  results['RLS Policies'] = await testRLS();
  results['Cleanup'] = await testCleanup();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));

  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([name, result]) => {
    console.log(`${result ? '✅' : '❌'} ${name}`);
  });

  console.log('═'.repeat(60));
  console.log(`\n🎯 Result: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
};

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});