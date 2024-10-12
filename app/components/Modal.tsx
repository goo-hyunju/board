'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Modal.module.css';

type FormData = {
  title: string;
  content: string;
};

export default function Modal({
  onClose,
  onSave,
  fetchPosts,
}: {
  onClose: () => void;
  onSave: (title: string, content: string, files: File[]) => Promise<void>;
  fetchPosts: () => Promise<void>;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [fileInputs, setFileInputs] = useState<Array<File | null>>([]); // 파일 입력 필드를 관리하는 상태

  // 파일 선택 시 파일 배열에 추가
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files && files[0]) {
      const updatedFiles = [...fileInputs];
      updatedFiles[index] = files[0]; // 해당 인덱스의 파일을 업데이트
      setFileInputs(updatedFiles);
    }
  };

  // 새로운 파일 입력 필드 추가
  const addFileInput = () => {
    setFileInputs([...fileInputs, null]); // 새로운 파일 입력 필드를 추가
  };

  // 제출 처리 함수
  const onSubmit = async (data: FormData) => {
    const nonNullFiles = fileInputs.filter(file => file !== null) as File[]; // null이 아닌 파일만 필터링
    await onSave(data.title, data.content, nonNullFiles); // 여러 파일을 onSave로 전달
    await fetchPosts();
    reset();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>게시글 작성</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            {...register('title', { required: true })}
            className={styles.inputField}
          />
          {errors.title && <span className={styles.errorMessage}>제목을 입력하세요</span>}

          <textarea
            placeholder="내용을 입력하세요"
            {...register('content', { required: true })}
            className={styles.textareaField}
          />
          {errors.content && <span className={styles.errorMessage}>내용을 입력하세요</span>}

          {/* 파일 입력 필드들을 렌더링 */}
          {fileInputs.map((file, index) => (
            <div key={index} className={styles.fileInputContainer}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)} // 파일 선택 처리
                className={styles.fileInput}
              />
            </div>
          ))}

          <button type="button" onClick={addFileInput} className={styles.addFileButton}>
            파일 추가
          </button>

          <div className={styles.buttonContainer}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
            <button type="submit" className={styles.saveButton}>저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}
