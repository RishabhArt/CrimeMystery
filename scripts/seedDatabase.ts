/**
 * Database Seeding Script
 * This script populates the Supabase database with test data
 * 
 * Run with: npx ts-node scripts/seedDatabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Seed cases
 */
const seedCases = async () => {
  console.log('🌱 Seeding cases...');

  const cases = [
    {
      title: 'The Midnight Heist',
      description: 'A precious diamond has been stolen from museum. Find the culprit before dawn.',
      long_description: 'A priceless diamond has been stolen from the city museum. You have been called in to investigate. Multiple suspects, clues, and twists await you.',
      difficulty: 'easy',
      thumbnail_url: 'https://images.unsplash.com/photo-1557672172-298e090d0f80?w=400&h=300&fit=crop',
      storyline: 'A museum heist at midnight',
      total_episodes: 5,
      total_chapters: 15,
      estimated_play_time: 45,
      is_published: true,
      is_featured: true,
      case_number: 1,
      max_level_required: 1,
    },
    {
      title: 'Murder in the Manor',
      description: 'A wealthy businesswoman is found dead. Uncover the secrets within the manor walls.',
      long_description: 'A wealthy businesswoman has been found dead in her lavish manor. Secrets, lies, and motives abound. Can you uncover the truth?',
      difficulty: 'medium',
      thumbnail_url: 'https://images.unsplash.com/photo-1604187556535-cd40fc11b340?w=400&h=300&fit=crop',
      storyline: 'A murder mystery in a grand mansion',
      total_episodes: 6,
      total_chapters: 18,
      estimated_play_time: 90,
      is_published: true,
      is_featured: true,
      case_number: 2,
      max_level_required: 5,
    },
    {
      title: 'Lost in Translation',
      description: 'An ancient artifact has gone missing. Decode the mysterious messages to recover it.',
      long_description: 'An ancient artifact has been stolen and hidden away. Follow cryptic clues and decode mysterious messages to recover it.',
      difficulty: 'hard',
      thumbnail_url: 'https://images.unsplash.com/photo-1578375060372-8c81876b2fe0?w=400&h=300&fit=crop',
      storyline: 'A race against time to recover a lost artifact',
      total_episodes: 8,
      total_chapters: 24,
      estimated_play_time: 150,
      is_published: true,
      is_featured: false,
      case_number: 3,
      max_level_required: 15,
    },
  ];

  try {
    for (const caseData of cases) {
      const { data, error } = await supabase
        .from('cases')
        .insert([caseData])
        .select();

      if (error) {
        console.error(`❌ Error seeding case "${caseData.title}":`, error);
      } else {
        console.log(`✅ Seeded case: ${caseData.title}`);
      }
    }
  } catch (error) {
    console.error('❌ Error in seedCases:', error);
  }
};

/**
 * Seed chapters
 */
const seedChapters = async () => {
  console.log('\n🌱 Seeding chapters...');

  try {
    // Get all cases
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id')
      .limit(1);

    if (casesError || !cases || cases.length === 0) {
      console.error('No cases found');
      return;
    }

    const caseId = cases[0].id;

    const chapters = Array.from({ length: 5 }, (_, i) => ({
      case_id: caseId,
      chapter_number: i + 1,
      title: `Chapter ${i + 1}: Investigation Begins`,
      description: `Part ${i + 1} of the investigation`,
      reward_xp: 100 + i * 50,
      is_locked: i > 0,
      required_level: i > 0 ? (i - 1) * 2 + 1 : 1,
    }));

    for (const chapter of chapters) {
      const { error } = await supabase
        .from('chapters')
        .insert([chapter]);

      if (error) {
        console.error(`❌ Error seeding chapter:`, error);
      } else {
        console.log(`✅ Seeded chapter: ${chapter.title}`);
      }
    }
  } catch (error) {
    console.error('❌ Error in seedChapters:', error);
  }
};

/**
 * Main seed function
 */
const main = async () => {
  console.log('🚀 Starting database seeding...\n');

  await seedCases();
  await seedChapters();

  console.log('\n✨ Database seeding complete!');
  process.exit(0);
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
