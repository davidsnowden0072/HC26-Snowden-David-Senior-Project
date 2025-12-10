/**
 * supabase.js
 * 
 * Initializes and exports the Supabase client for database operations.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://uchwzvymdthndlumpqab.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error("❌ Missing SUPABASE_KEY environment variable");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase client initialized");