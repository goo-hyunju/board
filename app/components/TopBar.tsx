'use client';

import { useRouter } from 'next/navigation';
import UserImage from '../assets/image';
import styles from './TopBar.module.css';

export default function TopBar() {
  const router = useRouter();

  const handleUserClick = () => {
    router.push('/user'); // 사용자 관리 페이지로 이동
  };

  const handleLogoClick = () => {
    router.push('/home'); // 로고 클릭 시 /home으로 이동
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.logo} onClick={handleLogoClick}> {/* 로고 클릭 시 이벤트 */}
        WEEDS
      </div>
      <div className={styles.userProfile} onClick={handleUserClick}>
        <UserImage />
      </div>
    </header>
  );
}
