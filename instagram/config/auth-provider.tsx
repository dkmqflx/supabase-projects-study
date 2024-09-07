"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function AuthProvider({ accessToken, children }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // 예를 들어 유저가 로그아웃을 했으면 세션의 액세스 토큰과 이 인자로 받은 액세스
      // 토큰, 즉 그냥 기존의 서버에 갖고 있던 액세스 토큰이 달라지게 되는데 그러면 무조건 리프레시 해준다
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });
    // supabase에서는 유저의 인증 상태가 변경이 됐을 때, 즉 유저의 이름이 바뀌었다거나,
    // 유저가 로그인한 상태가 바뀌었다거나, 액세스 토큰이 만료가 됐다거나, 로그아웃을 했다거나,
    // 이런 다양한 이벤트들이 일어났을 때, 이런 콜백 함수를 통해서 그 이벤트를 구독을 할 수 있게 해준다.

    return () => {
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}
