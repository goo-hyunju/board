// UserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../slices/authSlice'; // Redux action
import styles from './UserManagement.module.css';
import TopBar from '../components/TopBar';
import UserModal from './UserModal';

interface User {
  username: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  profileImage?: string;
}

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [user, setUser] = useState<User | null>(null); // 로그인된 사용자 정보 상태 관리
  const dispatch = useDispatch();

  // 로그인 상태를 Redux에서 가져옴
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 백엔드에서 사용자 정보를 가져오는 함수
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      const response = await fetch('http://localhost:8080/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data); // 사용자 정보를 상태로 설정
      } else {
        console.error('사용자 정보를 불러오는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 컴포넌트가 마운트될 때 사용자 정보 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    dispatch(logout()); // Redux를 통해 로그아웃 상태 변경
    alert('로그아웃 되었습니다.');
  };

  if (!user) {
    return <div>로딩 중...</div>; // 사용자 정보가 없을 때 로딩 상태 표시
  }

  return (
    <div>
        <TopBar />
      <div className={styles.container}>
        <h1 className={styles.title}>기본정보</h1>
        <div className={styles.userInfo}>
          <div className={styles.imageSection}>
            <img
              src={user.profileImage || '/default-profile.png'} // 프로필 이미지가 없을 경우 기본 이미지 표시
              alt="User Profile"
              className={styles.profileImage}
            />
            <button className={styles.imageButton}>사진 관리</button>
          </div>
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label>이름</label>
              <input type="text" value={user.username} readOnly />
            </div>
            <div className={styles.infoItem}>
              <label>회사</label>
              <input type="text" value="WEEDS" readOnly />
            </div>
            <div className={styles.infoItem}>
              <label>부서</label>
              <input type="text" value={user.department || '부서 없음'} readOnly />
            </div>
            <div className={styles.infoItem}>
              <label>직무</label>
              <input type="text" value={user.position || '직무 없음'} readOnly />
            </div>
            <div className={styles.infoItem}>
              <label>이메일</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div className={styles.infoItem}>
              <label>휴대폰</label>
              <input type="tel" value={user.phone || '휴대폰 정보 없음'} readOnly />
            </div>
          </div>
        </div>
        <button className={styles.manageButton} onClick={() => setIsModalOpen(true)}>
          사용자 관리
        </button>
        {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}
