'use client';
// 회원가입 페이지

import { Button, Input } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function SignUp({ setView }) {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  // 인증구현 - 인증링크 방식 회원가입 구현 강의에서는 otp 방식아니라 이메일로 링크를 보내고 해당 링크를 클릭하면 회원가입을 하는 방식을 배운다
  // 아래 코드는 otp로 인증을 하는 방식

  const supabase = createBrowserSupabaseClient();
  // signup mutation

  // 이메일로 회원가입
  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/signup/confirm',
          // 유저가 회원가입이 끝나고, 이메일 링크를 클릭을 하고
          // supabase 서버에서 실제 회원가입 완료까지 다 처리된 다음에 이 url로 넘어오게 된다
        },
      });
      // 해당 함수를 통해서 가입하기 버튼을 클릭하면 입력한 이메일 주소로 이메일이 전달된다

      // 정상적으로 데이터가 온 경우
      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  // otp로 회원가입
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (data) {
        console.log(data);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  // 카카오 로그인 함수
  const signInWithKakao = async () => {
    // signInWithOAuth 함수는 계정이 없으면 무조건 만들게 되어있기 때문에 signup을 위해서 별도로 구현해줄 필요가 없다
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
        {confirmationRequired ? (
          // otp 숫자로 회원가입하는 경우
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            label="otp"
            type="text"
            className="w-full rounded-sm"
            placeholder="6자리 OTP를 입력해주세요."
          />
        ) : (
          <>
            {/* 이메일로 회원가입하는 경우 */}
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
          </>
        )}
        <Button
          onClick={() => {
            if (confirmationRequired) {
              // 2. otp 입력해서 가입하기
              verifyOtpMutation.mutate();
            } else {
              // 1. 입력한 이메일 정보로 opt 정보 받기
              signupMutation.mutate();
            }
          }}
          loading={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          color="light-blue"
          className="w-full text-md py-1"
        >
          {confirmationRequired ? '인증하기' : '가입하기'}
        </Button>

        <Button
          className="w-full text-md py-1 bg-yellow-700"
          onClick={() => signInWithKakao()}
        >
          카카오 로그인
        </Button>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        이미 계정이 있으신가요?{' '}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView('SIGNIN')}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
