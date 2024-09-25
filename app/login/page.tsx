// C:\Users\구현주\Desktop\weeds\project\login-app2\app\login\page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text(); // 서버로부터 토큰 수신
        localStorage.setItem('token', token); // 토큰 저장
        dispatch(login(token)); // 로그인 상태 업데이트
        router.push('/home'); // 홈으로 이동
        alert('로그인 성공!');
      } else {
        const errorData = await response.text();
        alert(errorData || '아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
