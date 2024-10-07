import { useState } from 'react';
import styles from './EditUserModal.module.css';

interface User {
  id: any;
  username: string;
  userid: string;
  email: string;
  department: string;
  position: string;
  phone: string;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export default function EditUserModal({ user, onClose, onUserUpdate }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUserUpdate(updatedUser);
        onClose();
      } else {
        console.error('사용자 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 공통된 formRow 생성 함수
  const renderFormRow = (label: string, name: keyof User, value: string, type = 'text', disabled = false) => (
    <div className={styles.formRow}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled} // 비활성화 속성 추가
      />
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.h2}>사용자 정보 수정</h2>
        {renderFormRow('이름', 'username', editedUser.username)}
        {renderFormRow('계정', 'userid', editedUser.userid, 'text', true)} {/* 계정 필드 비활성화 */}
        {renderFormRow('이메일', 'email', editedUser.email, 'email')}
        {renderFormRow('부서', 'department', editedUser.department)}
        {renderFormRow('직무', 'position', editedUser.position)}
        {renderFormRow('휴대폰', 'phone', editedUser.phone)}

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleSave}>저장</button>
          <button className={styles.button} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
