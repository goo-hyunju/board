// C:\Users\구현주\Desktop\weeds\project\login-app2\app\assets\LogoutImage.tsx
'use client';

import styles from './LogoutImage.module.css'; // 기존 Image.module.css 사용

export default function LogoutImage() {
  return (
    <div className={styles.imageContainer}>
      <img
        src="/logout.png" // public 폴더에서 로그아웃 이미지를 불러옴
        alt="Logout"
        className={styles.profileImage} // 동일한 스타일 적용
      />
    </div>
  );
}
