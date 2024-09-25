'use client';

import { useForm } from 'react-hook-form';
import styles from './Modal.module.css';

type FormData = {
  title: string;
  content: string;
  file: FileList;
};

export default function Modal({
  onClose,
  onSave,
  fetchPosts,
}: {
  onClose: () => void;
  onSave: (title: string, content: string, file: File | null) => Promise<void>;
  fetchPosts: () => Promise<void>;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const file = data.file[0] || null;

    await onSave(data.title, data.content, file);
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

          <input type="file" {...register('file')} className={styles.fileInput} />

          <div className={styles.buttonContainer}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
            <button type="submit" className={styles.saveButton}>저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}
