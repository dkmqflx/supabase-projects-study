'use client';

// 로그인 페이지

import { Button, Input } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function SignIn({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createBrowserSupabaseClient();

  // 로그읜 함수
  const signInMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data) {
        console.log(data);
      }

      // 로그인 정보  틀린 경우
      if (error) {
        alert(error.message);
      }
    },
  });

  // 카카오 로그인 함수
  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    });
    // 카카오 로그인 버튼을 눌렀을 때
    // 1. 카카오 로그인 서버를 갔다가
    // 2. supabase 서버를 갔다가
    // 3, 나의 사이트로 돌아온다.

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
        <img src={'/images/inflearngram.png'} className="w-60 mb-6" />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="email"
          type="email"
          className="w-full rounded-sm"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="password"
          type="password"
          className="w-full rounded-sm"
        />
        <Button
          onClick={() => {
            signInMutation.mutate();
          }}
          loading={signInMutation.isPending}
          disabled={signInMutation.isPending}
          color="light-blue"
          className="w-full text-md py-1"
        >
          로그인
        </Button>
        <Button
          className="w-full text-md py-1 bg-yellow-700"
          onClick={() => signInWithKakao()}
        >
          카카오 로그인
        </Button>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        아직 계정이 없으신가요?{' '}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView('SIGNIN')}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
