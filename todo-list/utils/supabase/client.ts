'use client';

import { createBrowserClient } from '@supabase/ssr';

// supabase SDK를 사용하기 위해 initialize 해주는 부분
export const createBrowserSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
// https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/utils/supabase/client.ts
