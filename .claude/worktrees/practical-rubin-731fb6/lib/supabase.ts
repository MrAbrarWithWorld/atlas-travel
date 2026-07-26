import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseKey) {
  console.warn('Supabase key not set — blog data will be empty');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
