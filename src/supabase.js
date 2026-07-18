import { createClient } from '@supabase/supabase-js';

// This is a publishable browser key. Database access is protected by RLS policies.
export const supabase = createClient(
  'https://rfzrklwmhetxkkwsvjck.supabase.co',
  'sb_publishable_1R5q2ZHNDrjar2NvBMDvmA_UexmTx8a'
);
