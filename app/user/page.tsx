'use client';

import styles from './UserManagement.module.css';
import TopBar from '../components/TopBar'; // TopBar 컴포넌트 가져오기

export default function UserManagement() {
  return (
    <div>
      <TopBar /> {/* 상단바 추가 */}
      <div className={styles.container}>
        <h1 className={styles.title}>기본정보</h1>
        
        <div className={styles.userInfo}>
          <div className={styles.imageSection}>
            <img src="/user.png" alt="User Profile" className={styles.profileImage} />
            <button className={styles.imageButton}>사진 관리</button>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label>이름</label>
              <input type="text" value="구현주" readOnly />
            </div>

            <div className={styles.infoItem}>
              <label>회사</label>
              <input type="text" value="WEEDS" readOnly />
            </div>

            <div className={styles.infoItem}>
              <label>부서</label>
              <input type="text" value="개발부문" />
            </div>

            <div className={styles.infoItem}>
              <label>직무</label>
              <input type="text" value="BA" />
            </div>

            <div className={styles.infoItem}>
              <label>이메일</label>
              <input type="email" value="hj.goo00@weeds.co.kr" readOnly />
            </div>

            <div className={styles.infoItem}>
              <label>휴대폰</label>
              <input type="tel" value="010-5507-1435" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
