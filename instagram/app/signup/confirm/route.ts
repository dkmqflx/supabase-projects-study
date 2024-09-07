import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";

// components/auth/signup.tsx에서 emailRedirectTo로 이동하는 route에 해당한다

// localhost:3000/signup/confirm/?code=...
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code"); // code 값을 가지고 온다

  if (code) {
    const supabase = await createServerSupabaseClient();

    await supabase.auth.exchangeCodeForSession(code);
    // code가 정상적이라면 session을 획득하게 된다
  }

  // 마지막에는 아래와 같은 주소로 리다이렉트 된다
  // localhost:3000/
  return NextResponse.redirect(requestUrl.origin);
  // 그리고 유저를 리다이렉트 시킨다
}
