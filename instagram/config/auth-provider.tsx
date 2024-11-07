'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function AuthProvider({ accessToken, children }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // https://supabase.com/docs/reference/javascript/auth-onauthstatechange

      // 유저의 인증 상태가 변경되었을 때, 즉 유저의 이름이 바뀌었거나
      // 유저가 로그인한 상태가 바뀌었다거나, accessToken이 만료가 됬다거나
      // 로그아웃 했다거나 등 이런 다양한 이벤트들이 일어났을 때, 이런 콜백함수를 통해서
      // 그 이벤트를 구독 할 수 있게 해준다

      // 아래는 유저가 로그아웃 한 경우, 세션의 acessToken과 인자로 받은 accessToken이 달라진다
      // 그때 무조건 리프레시를 해준다
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      // 페이지가 닫혔을 때
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}
