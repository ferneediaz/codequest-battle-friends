
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://prrpkxpymithbynrfkqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycnBreHB5bWl0aGJ5bnJma3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTg4MjQsImV4cCI6MjA1NjMzNDgyNH0.f4w9RJX-Gp8qGSGEAXz6OuRVLuLIl6uGHH39AUUPXJQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
