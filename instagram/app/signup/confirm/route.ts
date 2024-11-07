import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

// 이 파일은 signupMutation 함수의 emailRedirectTo로 인해 리다이렉트 되는 경로

// localhost:3000/signup/confirm/?code=...
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // 코드 값이 정상적으로 있다면
  if (code) {
    const supabase = await createServerSupabaseClient();

    // 코드가 정상적이라면 여기서 session을 정상적으로 획득하게 된다
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 리다이렉트 시킨다
  // localhost:3000/
  return NextResponse.redirect(requestUrl.origin);
}
