import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { login, logout } from '../slices/authSlice';
import LogoutImage from '../assets/LogoutImage';
import styles from './TopBar.module.css';

interface User {
  profileImage?: string;
}

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null); // 사용자 정보를 저장할 상태
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux에서 로그인 상태를 가져옴
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(login()); // 토큰이 있을 경우 Redux 상태를 로그인으로 설정
      fetchUserData(); // 사용자 데이터 가져오기
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://172.16.30.182:40001/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const handleUserClick = () => {
    router.push('/user'); // 사용자 관리 페이지로 이동
  };

  const handleLogoClick = () => {
    router.push('/home'); // 홈으로 이동
  };

  const handleLogoutClick = () => {
    dispatch(logout()); // 로그아웃 처리
    localStorage.removeItem('token'); // 토큰 삭제
    router.push('/login'); // 로그인 페이지로 이동
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        WEEDS
      </div>
      <div className={styles.actions}>
        {isLoggedIn ? (
          <>
            <div className={styles.userProfile} onClick={handleUserClick}>
              {user?.profileImage ? (
                <img
                src={`http://172.16.30.182:40001/uploads/profiles/${user?.profileImage?.split('/').pop()}`} // 사용자 프로필 이미지 경로
                  alt="User Profile"
                  className={styles.profileImage}
                />
              ) : (
                <img
                  src="/user.png" // 기본 사용자 이미지
                  alt="Default User"
                  className={styles.profileImage}
                />
              )}
            </div>
            <div className={styles.logoutButton} onClick={handleLogoutClick}>
              <LogoutImage /> {/* 로그아웃 버튼 이미지 */}
            </div>
          </>
        ) : (
          <div className={styles.loginText} onClick={() => router.push('/login')}>
            로그인 {/* 비로그인 시 로그인 문구 표시 */}
          </div>
        )}
      </div>
    </header>
  );
}
