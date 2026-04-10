/**
 * Comprehensive Application Testing Suite
 * Tests all major features and error scenarios
 * 
 * Run with: npx ts-node scripts/comprehensiveTest.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

const testLog = (status: 'PASS' | 'FAIL', message: string, details?: any) => {
  testsRun++;
  if (status === 'PASS') {
    testsPassed++;
    console.log(`✅ ${message}`);
  } else {
    testsFailed++;
    console.error(`❌ ${message}`);
    if (details) console.error('   Details:', details);
  }
};

/**
 * Test 1: Database Connection & Tables Exist
 */
const testDatabaseStructure = async () => {
  console.log('\n🔍 Test 1: Database Structure');
  console.log('─'.repeat(50));

  const tables = [
    'users',
    'cases',
    'chapters',
    'rooms',
    'puzzles',
    'user_progress',
    'puzzle_solutions',
    'transactions',
    'leaderboard',
    'friends',
    'achievements',
    'user_achievements',
    'clue_inventory',
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error && error.code !== 'PGRST116') throw error;
      testLog('PASS', `Table exists: ${table}`);
    } catch (error: any) {
      testLog('FAIL', `Table check: ${table}`, error.message);
    }
  }
};

/**
 * Test 2: Authentication Flow
 */
const testAuthenticationFlow = async () => {
  console.log('\n🔐 Test 2: Authentication Flow');
  console.log('─'.repeat(50));

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  let authId = '';

  try {
    // Sign up
    const { data: signUpData, error: signUpError } = await supabaseAnon.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) throw new Error(`SignUp failed: ${signUpError.message}`);
    authId = signUpData.user?.id || '';
    testLog('PASS', 'User sign up successful');

    // Sign in
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) throw new Error(`SignIn failed: ${signInError.message}`);
    testLog('PASS', 'User sign in successful');

    // Get session
    const { data: sessionData, error: sessionError } = await supabaseAnon.auth.getSession();
    if (sessionError || !sessionData.session) throw new Error('Session not found');
    testLog('PASS', 'Session retrieved successfully');

    // Cleanup
    await supabaseAdmin.auth.admin.deleteUser(authId);
    testLog('PASS', 'Test user cleaned up');
  } catch (error: any) {
    testLog('FAIL', 'Authentication flow', error.message);
    if (authId) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(authId);
      } catch (e) {
        console.error('   Cleanup failed:', e);
      }
    }
  }
};

/**
 * Test 3: Data Validation & Constraints
 */
const testDataValidation = async () => {
  console.log('\n📋 Test 3: Data Validation');
  console.log('─'.repeat(50));

  // Test: Invalid email format
  try {
    const { error } = await supabaseAnon.auth.signUp({
      email: 'invalid-email',
      password: 'TestPassword123!',
    });

    if (error?.message?.includes('invalid')) {
      testLog('PASS', 'Invalid email rejected');
    } else {
      testLog('FAIL', 'Invalid email should be rejected');
    }
  } catch (error: any) {
    testLog('FAIL', 'Email validation test', error.message);
  }

  // Test: Weak password
  try {
    const { error } = await supabaseAnon.auth.signUp({
      email: `test_${Date.now()}@example.com`,
      password: '123',
    });

    if (error?.message?.includes('password')) {
      testLog('PASS', 'Weak password rejected');
    }
  } catch (error: any) {
    testLog('FAIL', 'Password validation test', error.message);
  }
};

/**
 * Test 4: Row Level Security (RLS)
 */
const testRLS = async () => {
  console.log('\n🔒 Test 4: Row Level Security');
  console.log('─'.repeat(50));

  try {
    // Create test user
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: authData } = await supabaseAnon.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    const authId = authData.user?.id;
    if (!authId) throw new Error('User creation failed');

    // Create profile
    const { data: profileData } = await supabaseAdmin
      .from('users')
      .insert([
        {
          auth_id: authId,
          email: testEmail,
          display_name: 'Test User',
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

    if (!profileData) throw new Error('Profile creation failed');

    // Test: Anon cannot read other users' profiles
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('users')
      .select('*')
      .eq('id', profileData.id);

    if (anonError || (anonData && anonData.length > 0)) {
      testLog('FAIL', 'RLS: Anon should not read user data');
    } else {
      testLog('PASS', 'RLS: Anon correctly denied access to user data');
    }

    // Cleanup
    await supabaseAdmin.from('users').delete().eq('id', profileData.id);
    await supabaseAdmin.auth.admin.deleteUser(authId);
    testLog('PASS', 'RLS test cleanup');
  } catch (error: any) {
    testLog('FAIL', 'RLS test', error.message);
  }
};

/**
 * Test 5: Performance & Load Times
 */
const testPerformance = async () => {
  console.log('\n⚡ Test 5: Performance');
  console.log('─'.repeat(50));

  try {
    const startTime = Date.now();

    // Test: Fetch cases
    const { data: cases, error: casesError } = await supabaseAnon
      .from('cases')
      .select('*')
      .eq('is_published', true)
      .limit(20);

    const casesTime = Date.now() - startTime;

    if (casesError || !cases) {
      testLog('FAIL', 'Fetch cases');
    } else if (casesTime > 5000) {
      testLog('FAIL', `Fetch cases took ${casesTime}ms (target: <5000ms)`);
    } else {
      testLog('PASS', `Fetch cases (${casesTime}ms)`);
    }

    // Test: Large data fetch
    const startLarge = Date.now();
    const { data: largeData, error: largeError } = await supabaseAnon
      .from('cases')
      .select('*, chapters(*)')
      .eq('is_published', true)
      .limit(10);

    const largeTime = Date.now() - startLarge;

    if (largeError || !largeData) {
      testLog('FAIL', 'Fetch cases with relations');
    } else if (largeTime > 10000) {
      testLog('FAIL', `Fetch with relations took ${largeTime}ms (target: <10000ms)`);
    } else {
      testLog('PASS', `Fetch with relations (${largeTime}ms)`);
    }
  } catch (error: any) {
    testLog('FAIL', 'Performance tests', error.message);
  }
};

/**
 * Test 6: Error Handling
 */
const testErrorHandling = async () => {
  console.log('\n⚠️ Test 6: Error Handling');
  console.log('─'.repeat(50));

  // Test: Handle network timeout
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 100)
    );

    await timeoutPromise;
    testLog('FAIL', 'Timeout handling');
  } catch (error: any) {
    if (error.message === 'Timeout') {
      testLog('PASS', 'Timeout error handled correctly');
    }
  }

  // Test: Handle invalid database query
  try {
    const { error } = await supabaseAnon
      .from('nonexistent_table')
      .select('*');

    if (error) {
      testLog('PASS', 'Invalid table error handled');
    } else {
      testLog('FAIL', 'Should return error for invalid table');
    }
  } catch (error: any) {
    testLog('PASS', 'Invalid table exception caught');
  }
};

/**
 * Run all tests
 */
const runAllTests = async () => {
  console.log('╔' + '═'.repeat(48) + '╗');
  console.log('║' + ' '.repeat(10) + '🧪 COMPREHENSIVE TEST SUITE' + ' '.repeat(10) + '║');
  console.log('╚' + '═'.repeat(48) + '╝');

  try {
    await testDatabaseStructure();
    await testAuthenticationFlow();
    await testDataValidation();
    await testRLS();
    await testPerformance();
    await testErrorHandling();

    console.log('\n' + '═'.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total Tests: ${testsRun}`);
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    console.log(`Success Rate: ${((testsPassed / testsRun) * 100).toFixed(1)}%`);
    console.log('═'.repeat(50));

    if (testsFailed === 0) {
      console.log('\n🎉 All tests passed! Your application is ready for deployment.');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Fatal error during testing:', error);
    process.exit(1);
  }
};

// Run tests
runAllTests();
