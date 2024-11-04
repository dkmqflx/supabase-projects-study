import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const applyMiddlewareSupabaseClient = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // refreshing the auth token
  await supabase.auth.getUser();

  return response;
};

export async function middleware(request) {
  return await applyMiddlewareSupabaseClient(request);
  // 이렇게 미들웨어로 중간 과정에 supabase가 끼어들게 되면, 위에 있는  supabase.auth.getUser();를 미리 호출해준다
  // 이렇게 하면 매번 뭔가 토큰을 받아오는 과정을 하지 않더라도 제일 항상 최신화된 유저 상태를 받아올 수 있게 된다.
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts#supabase-utilities
// https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/middleware.ts
