/**
 * Database Types - Synchronized with Supabase Schema
 */

// ============ USER TYPES ============
export interface User {
  id: string;
  auth_id: string;
  email: string;
  display_name: string;
  profile_image_url: string | null;
  level: number;
  total_xp: number;
  total_clues_owned: number;
  free_clues_remaining: number;
  last_clue_reset: string;
  total_spent_amount: number;
  premium_expiry: string | null;
  premium_tier: 'monthly' | 'quarterly' | 'yearly' | null;
  purchased_skins: string[];
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  is_banned: boolean;
  ban_reason: string | null;
}

// ============ CASE TYPES ============
export interface Case {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  release_date: string;
  total_episodes: number;
  total_chapters: number;
  thumbnail_url: string;
  storyline: string;
  author_id: string | null;
  estimated_play_time: number | null;
  rating_count: number;
  rating_sum: number;
  completion_count: number;
  view_count: number;
  is_published: boolean;
  is_featured: boolean;
  case_number: number | null;
  max_level_required: number;
  created_at: string;
  updated_at: string;
}

// ============ CHAPTER TYPES ============
export interface Chapter {
  id: string;
  case_id: string;
  chapter_number: number;
  title: string;
  description: string;
  reward_xp: number;
  is_locked: boolean;
  required_level: number;
  created_at: string;
}

// ============ ROOM TYPES (3D Scene) ============
export interface Room {
  id: string;
  chapter_id: string;
  room_name: string;
  room_description: string | null;
  scene_image_url: string;
  model_url: string | null;
  room_config: RoomConfig;
  hotspots: Hotspot[];
  detective_dialogues: DialogueNode[];
  investigatable_items: InvestigableItem[];
  theme: string;
  is_interactive: boolean;
  difficulty_factor: number;
  created_at: string;
  updated_at: string;
}

export interface RoomConfig {
  scale: number;
  rotation: { x: number; y: number; z: number };
  lighting: {
    ambientLight: number;
    spotlightIntensity: number;
    spotlightColor: string;
  };
}

export interface Hotspot {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  clickRadius: number;
  itemId: string;
  interactionType: 'clue' | 'puzzle' | 'dialogue';
  animation?: string;
}

export interface InvestigableItem {
  id: string;
  name: string;
  clueText: string;
  clueImage?: string;
  isFree: boolean;
  clueCost?: number;
  type: 'evidence' | 'object' | 'clue';
}

export interface DialogueNode {
  id: string;
  speakerId: string;
  characterImage: string;
  text: string;
  animation?: string;
  emotion: 'neutral' | 'happy' | 'serious' | 'shocked';
  choices?: DialogueChoice[];
  nextNodeId?: string;
  sound?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string;
  impact?: 'relationship' | 'story' | 'clue';
}

// ============ PUZZLE TYPES ============
export type PuzzleType = 'match' | 'logic' | 'pattern' | 'sequence' | 'deduction';

export interface Puzzle {
  id: string;
  chapter_id: string;
  puzzle_type: PuzzleType;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question_text: string;
  puzzle_data: PuzzleData;
  correct_answer_id: string;
  explanation: string | null;
  hint: string | null;
  time_limit: number | null;
  reward_xp: number;
  max_attempts: number;
  solve_count: number;
  fail_count: number;
  order_in_chapter: number;
  is_required: boolean;
  created_at: string;
}

export type PuzzleData = 
  | MatchPuzzleData 
  | LogicPuzzleData 
  | PatternPuzzleData 
  | SequencePuzzleData 
  | DeductionPuzzleData;

export interface MatchPuzzleData {
  pairs: Array<{ id: string; image: string; match: string }>;
  timeAllowed: number;
}

export interface LogicPuzzleData {
  options: Array<{ id: string; text: string }>;
}

export interface PatternPuzzleData {
  pattern: string[];
  nextInSequence: string[];
  timeAllowed: number;
}

export interface SequencePuzzleData {
  items: Array<{ id: string; image: string; order: number }>;
  description: string;
}

export interface DeductionPuzzleData {
  suspects: Suspect[];
  clues: string[];
}

export interface Suspect {
  id: string;
  name: string;
  image: string;
  description: string;
}

// ============ PROGRESS TYPES ============
export interface UserProgress {
  id: string;
  user_id: string;
  case_id: string;
  chapter_id: string;
  current_chapter_number: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number;
  clues_used: number;
  puzzle_attempts: number;
  solution_correct: boolean | null;
  xp_earned: number;
  is_investigation_complete: boolean;
  last_accessed: string;
}

// ============ PUZZLE SOLUTION TYPES ============
export interface PuzzleSolution {
  id: string;
  user_id: string;
  puzzle_id: string;
  case_id: string;
  submitted_answer: string;
  is_correct: boolean;
  time_taken_seconds: number | null;
  attempts_count: number;
  hint_used: boolean;
  solved_at: string;
}

// ============ TRANSACTION TYPES ============
export type TransactionType = 'clue_purchase' | 'premium_subscription' | 'cosmetic_purchase';
export type PaymentMethod = 'iap_google' | 'iap_apple' | 'stripe';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  quantity: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_ref_id: string | null;
  receipt_data: string | null;
  refund_reason: string | null;
  refund_date: string | null;
  created_at: string;
}

// ============ LEADERBOARD TYPES ============
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url: string | null;
  total_score: number;
  cases_completed: number;
  episodes_completed: number;
  rank_global: number | null;
  rank_weekly: number | null;
  rank_monthly: number | null;
  period: 'global' | 'weekly' | 'monthly';
  updated_at: string;
}

// ============ FRIENDS TYPES ============
export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendStatus;
  added_at: string;
}

// ============ ACHIEVEMENT TYPES ============
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCondition = 
  | 'cases_completed' 
  | 'puzzles_solved' 
  | 'clues_used' 
  | 'perfect_case' 
  | 'speedrun' 
  | 'social';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: AchievementRarity;
  condition_type: AchievementCondition;
  condition_value: number | null;
  points_awarded: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

// ============ CLUE INVENTORY TYPES ============
export type ClueType = 'free_daily' | 'purchased' | 'reward';

export interface ClueInventory {
  id: string;
  user_id: string;
  clue_type: ClueType;
  clues_count: number;
  last_reset: string;
  expires_at: string | null;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============ ANALYTICS TYPES ============
export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, any>;
  screen_name: string | null;
  session_id: string | null;
  timestamp: string;
}

// ============ ERROR TYPES ============
export interface AppError {
  id: string;
  user_id: string | null;
  error_code: string;
  error_message: string;
  stack_trace: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  app_version: string | null;
  device_info: Record<string, any> | null;
  context_data: Record<string, any> | null;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

// ============ AUTH TYPES ============
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ============ GAME STATE TYPES ============
export interface GameState {
  cases: Case[];
  currentCase: Case | null;
  chapters: Chapter[];
  currentRoom: Room | null;
  puzzles: Puzzle[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
}

// ============ UI STATE TYPES ============
export interface UIState {
  currentScreen: string;
  isLoading: boolean;
  loadingMessage: string;
  notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  darkModeEnabled: boolean;
}