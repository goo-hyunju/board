'use client';

import { useEffect, useState } from 'react';
import styles from './UserModal.module.css'; // 모달 스타일

interface User {
  id: number;
  username: string;
  email: string;
  department: string;
  position: string;
  phone: string;
}

export default function UserModal({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);

  // JWT 토큰을 로컬스토리지에서 가져오는 함수
  const getToken = () => localStorage.getItem('token');

  // 사용자 정보를 서버에서 가져오는 함수
  const fetchUsers = async () => {
    const token = getToken(); // 토큰 가져오기

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // 서버에서 가져온 데이터를 상태로 설정
      } else {
        console.error('사용자 정보를 불러오는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // 모달이 열릴 때 사용자 정보를 가져옴
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>사용자 목록</h2>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>부서</th>
              <th>직무</th>
              <th>휴대폰</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>{user.position}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
