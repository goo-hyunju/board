'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/find?username=' + username);
      const data = await response.json();

      if (data.password === password) {
          alert('로그인 성공!');
          router.push('/home');
      } else {
          alert('아이디 또는 비밀번호가 잘못되었습니다.');
      }
  } catch (error) {
      alert('로그인 중 문제가 발생했습니다.');
  }
};

  return (
    <div className="loginBox">
      <h1>weeds</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
