declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL?: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
      EXPO_PUBLIC_ENABLE_LOGS?: string;
      EXPO_PUBLIC_ENABLE_CRASH_REPORTING?: string;
      EXPO_PUBLIC_API_TIMEOUT?: string;
    }
  }
}

export {};
