'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../slices/authSlice'; // Redux action
import styles from './UserManagement.module.css';
import TopBar from '../components/TopBar';
import EditUserModal from './EditUserModal'; // 사용자 정보 수정 모달
import UserListModal from './UserListModal'; // 사용자 목록 모달

interface User {
  id: number;
  username: string;
  userid: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  profileImage?: string;
}

export default function UserManagement() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 사용자 정보 수정 모달 상태 관리
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false); // 사용자 목록 모달 상태 관리
  const [user, setUser] = useState<User | null>(null); // 로그인된 사용자 정보 상태 관리
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 업로드할 파일 상태 관리
  const dispatch = useDispatch();

  // 로그인 상태를 Redux에서 가져옴
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 백엔드에서 사용자 정보를 가져오는 함수
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      const response = await fetch('http://172.16.30.182:40001/api/users/me', {
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

  // 파일이 선택되었을 때 호출되는 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://172.16.30.182:40001/api/users/uploadProfileImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // 토큰 추가
        },
        body: formData,
      });

      if (response.ok) {
        alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
        fetchUserData(); // 사용자 정보 다시 가져오기
      } else {
        console.error('이미지 업로드 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
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
              src={`http://172.16.30.182:40001/uploads/profiles/${user?.profileImage?.split('/').pop()}`}  // 프로필 이미지가 없을 경우 기본 이미지 표시
              alt="User Profile"
              className={styles.profileImage}
            />
            <input type="file" onChange={handleFileChange} /> {/* 파일 선택 input */}
            <button className={styles.imageButton} onClick={handleFileUpload}>
              사진 업로드
            </button>
          </div>
          <div className={styles.infoSection}>
            <InfoItem label="이름" value={user.username} />
            <InfoItem label="계정" value={user.userid} />
            <InfoItem label="회사" value="WEEDS" />
            <InfoItem label="부서" value={user.department || '부서 없음'} />
            <InfoItem label="직무" value={user.position || '직무 없음'} />
            <InfoItem label="이메일" value={user.email} />
            <InfoItem label="휴대폰" value={user.phone || '휴대폰 정보 없음'} />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.manageButton} onClick={() => setIsEditModalOpen(true)}>
            사용자 정보 수정
          </button>
          <button className={styles.userListButton} onClick={() => setIsUserListModalOpen(true)}>
            사용자 목록 보기
          </button>
        </div>

        {isEditModalOpen && (
          <EditUserModal
            user={user}
            onClose={() => setIsEditModalOpen(false)}
            onUserUpdate={setUser}
          />
        )}

        {isUserListModalOpen && <UserListModal onClose={() => setIsUserListModalOpen(false)} />}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <label className={styles.label}>{label}</label>
      <input type="text" value={value} readOnly className={styles.input} />
    </div>
  );
}
