import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  if (!supabaseUrl.includes('your-project')) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✓ Supabase initialized:', supabaseUrl);
    } catch (err) {
      console.error('✗ Supabase initialization failed:', err);
    }
  } else {
    console.warn('⚠ Supabase credentials are placeholders. Configure .env.local with real credentials.');
  }
} else {
  console.warn('⚠ Supabase credentials not configured.');
  console.warn('⚠ Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local');
}

export { supabase };
