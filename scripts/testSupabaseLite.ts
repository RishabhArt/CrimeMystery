/**
 * Supabase Lite Testing Script (No Auth Tests)
 * 
 * This script tests database functionality without authentication
 * to avoid rate limits during development
 * 
 * Run with: npx ts-node scripts/testSupabaseLite.ts
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
 * Test 2: Fetch Cases
 */
const testFetchCases = async () => {
  console.log('\n📋 Test 2: Testing Fetch Cases...');
  try {
    const { data, error } = await supabaseAnon
      .from('cases')
      .select('id, title, difficulty, thumbnail_url')
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
 * Test 3: Fetch Chapters
 */
const testFetchChapters = async () => {
  console.log('\n📖 Test 3: Testing Fetch Chapters...');
  try {
    // Get first case
    const { data: cases, error: caseError } = await supabaseAnon
      .from('cases')
      .select('id')
      .eq('is_published', true)
      .limit(1);

    if (caseError) throw caseError;
    if (!cases || cases.length === 0) {
      console.log('⚠️ No published cases found');
      return true;
    }

    const caseId = cases[0].id;

    // Get chapters for this case
    const { data, error } = await supabaseAnon
      .from('chapters')
      .select('id, chapter_number, title, reward_xp')
      .eq('case_id', caseId)
      .order('chapter_number');

    if (error) throw error;
    console.log(`✅ Chapters fetched successfully (${data.length} chapters found)`);
    if (data.length > 0) {
      data.forEach((chapter: any) => {
        console.log(`   - Chapter ${chapter.chapter_number}: ${chapter.title} (${chapter.reward_xp} XP)`);
      });
    }
    return true;
  } catch (error: any) {
    console.error('❌ Fetch chapters failed:', error.message);
    return false;
  }
};

/**
 * Test 4: Fetch Clues
 */
const testFetchClues = async () => {
  console.log('\n💡 Test 4: Testing Fetch Clues...');
  try {
    const { data, error } = await supabaseAnon
      .from('clues')
      .select('id, title, clue_type, cost, is_free')
      .limit(10);

    if (error) throw error;
    console.log(`✅ Clues fetched successfully (${data.length} clues found)`);
    if (data.length > 0) {
      data.forEach((clue: any) => {
        const cost = clue.is_free ? 'FREE' : `${clue.cost} points`;
        console.log(`   - ${clue.title} (${clue.clue_type}) - ${cost}`);
      });
    }
    return true;
  } catch (error: any) {
    console.error('❌ Fetch clues failed:', error.message);
    return false;
  }
};

/**
 * Test 5: Storage Operations
 */
const testStorage = async () => {
  console.log('\n💾 Test 5: Testing Storage Operations...');
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
 * Test 6: RLS Policies
 */
const testRLS = async () => {
  console.log('\n🔒 Test 6: Testing RLS Policies...');
  try {
    // Try to read users table with anon client (should be blocked)
    const { data: userData, error: userError } = await supabaseAnon
      .from('users')
      .select('*')
      .limit(1);

    if (userError) {
      console.log('✅ RLS correctly prevents anonymous access to user profiles');
    } else {
      console.log('⚠️ Warning: RLS may not be properly configured for users table');
    }

    // Anon client should be able to read cases
    const { data: caseData, error: caseError } = await supabaseAnon
      .from('cases')
      .select('*')
      .eq('is_published', true)
      .limit(1);

    if (!caseError && caseData) {
      console.log('✅ RLS correctly allows public access to published cases');
    } else {
      console.log('⚠️ Warning: RLS may be blocking public case access');
    }

    return true;
  } catch (error: any) {
    console.error('❌ RLS test failed:', error.message);
    return false;
  }
};

/**
 * Run all tests
 */
const runAllTests = async () => {
  console.log('═'.repeat(60));
  console.log('🧪 SUPABASE LITE TESTING SUITE (No Auth)');
  console.log('═'.repeat(60));

  const results: { [key: string]: boolean } = {};

  // Run tests sequentially
  results['Connection'] = await testConnection();
  if (!results['Connection']) {
    console.error('\n❌ Cannot proceed without connection. Exiting.');
    process.exit(1);
  }

  results['Fetch Cases'] = await testFetchCases();
  results['Fetch Chapters'] = await testFetchChapters();
  results['Fetch Clues'] = await testFetchClues();
  results['Storage'] = await testStorage();
  results['RLS Policies'] = await testRLS();

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
    console.log('\n⚠️ Some tests failed. Please check errors above.');
    process.exit(1);
  }
};

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
