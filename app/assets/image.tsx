'use client';

import styles from './Image.module.css'; // CSS 모듈로 스타일링

export default function UserImage() {
  return (
    <div className={styles.imageContainer}>
      <img
        src="/user.png" // public 폴더에서 이미지를 불러옴
        alt="User Profile"
        className={styles.profileImage} // 스타일 적용
      />
    </div>
  );
}
