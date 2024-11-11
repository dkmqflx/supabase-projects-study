'use server';

import { createServerSupabaseAdminClient } from 'utils/supabase/server';

export async function getAllUsers() {
  // createServerSupabaseClient 를 사용하면 로그인한 유저만 가져올 수 있다.
  // 즉, 어드민 API에 대해 접근이 불가능한데, 다시말해 모든 유저들에 대한 정보를 가져오기 위해서
  // createServerSupabaseAdminClient를 사용한다

  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return [];
  }

  return data.users;
}

export async function getUserById(userId) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  return data.user;
}
