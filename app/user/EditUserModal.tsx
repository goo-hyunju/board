import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';  // react-toastify import
import 'react-toastify/dist/ReactToastify.css';  // react-toastify CSS import
import styles from './EditUserModal.module.css';

interface User {
  id: any;
  username: string;
  userid: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  password?: string;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export default function EditUserModal({ user, onClose, onUserUpdate }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState<User>({ ...user, password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return;
    }
  
    const userToSend = { ...editedUser };
    if (!userToSend.password) {
      delete userToSend.password; // 비밀번호가 비어 있으면 삭제
    }
  
    try {
      const response = await fetch(`http://172.16.30.182:40001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userToSend),
      });
  
      const result = await response.json(); // 응답을 JSON으로 파싱
  
      if (response.ok) {
        console.log('업데이트 성공:', result);
        onUserUpdate(result); // 업데이트된 사용자 정보 전달
        onClose(); // 모달 닫기
        toast.success('사용자 정보가 성공적으로 수정되었습니다!');
      } else {
        console.error(`API 오류 발생: ${response.statusText}`);
        toast.error(`사용자 정보 수정에 실패했습니다: ${result.message || response.statusText}`);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      toast.error('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
  

  const renderFormRow = (label: string, name: keyof User, value: string, type = 'text', disabled = false) => (
    <div className={styles.formRow}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}  // 비활성화 속성 추가
      />
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.h2}>사용자 정보 수정</h2>
        {renderFormRow('이름', 'username', editedUser.username)}
        {renderFormRow('계정', 'userid', editedUser.userid, 'text', true)}  {/* 계정 필드 비활성화 */}
        {renderFormRow('이메일', 'email', editedUser.email, 'email')}
        {renderFormRow('부서', 'department', editedUser.department)}
        {renderFormRow('직무', 'position', editedUser.position)}
        {renderFormRow('휴대폰', 'phone', editedUser.phone)}
        {renderFormRow('비밀번호', 'password', editedUser.password || '', 'password', true)}  {/* 비밀번호 필드 비활성화 */}

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleSave}>저장</button>
          <button className={styles.button} onClick={onClose}>취소</button>
        </div>
      </div>

      {/* ToastContainer 추가 */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
