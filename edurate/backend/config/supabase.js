/**
 * supabase.js
 * 
 * Initializes and exports the Supabase client for database operations.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://lhhaskcrrtaquzcddxpd.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error("❌ Warning: SUPABASE_KEY not found in environment");
  // Don't exit - let the app continue
} else {
  console.log("✅ Supabase client initialized");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
