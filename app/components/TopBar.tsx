import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { login, logout } from '../slices/authSlice';
import UserImage from '../assets/image';
import LogoutImage from '../assets/LogoutImage';
import styles from './TopBar.module.css';

export default function TopBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux에서 로그인 상태를 가져옴
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(login()); // 토큰이 있을 경우 Redux 상태를 로그인으로 설정
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

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
              <UserImage /> {/* 로그인 시 사용자 이미지 표시 */}
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
