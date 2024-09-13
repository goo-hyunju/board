'use client'; // 클라이언트 컴포넌트로 설정

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // 페이지가 로드되면 /login 경로로 이동
    router.push('/login');
  }, [router]);

  return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
}
