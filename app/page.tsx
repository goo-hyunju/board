'use client'; // 클라이언트 컴포넌트로 설정

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home'); // 토큰이 있으면 홈 페이지로 이동
    } else {
      router.push('/login'); // 토큰이 없으면 로그인 페이지로 이동
    }
  }, [router]);

  return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
}
