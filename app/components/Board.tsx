'use client';

import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import Modal from './Modal';

export default function Board() {
  const [posts, setPosts] = useState<{
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      username: string;
      email: string;
    };
    files: {
      id: number;
      fileName: string;
      filePath: string;
    }[] | null;
  }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUserId = 1; // 현재 로그인된 사용자의 ID

  // JWT 토큰을 가져오는 함수
  const getToken = () => localStorage.getItem('token');

  // 게시글 리스트를 백엔드에서 불러오는 함수
  const fetchPosts = async () => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('게시글을 불러오는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 페이지가 로드되면 게시글을 가져오는 useEffect
  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (title: string, content: string, file: File | null) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('authorId', currentUserId.toString());

    if (file) {
      formData.append('file', file);
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
        body: formData,
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts([savedPost, ...posts]);
      } else {
        console.error('게시글을 추가하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    // API를 호출할 때 파일 이름만 전달하도록 수정
    const downloadUrl = `http://localhost:8080/api/files/download/${fileName}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          게시글 추가
        </button>
      </div>

      <div className={styles.boardContainer}>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onSave={addPost}
            fetchPosts={fetchPosts}
          />
        )}

        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <h2 className={styles.title}>{post.title}</h2>
            <p className={styles.content}>{post.content}</p>
            <div className={styles.postFooter}>
              {post.author ? (
                <>
                  <span className={styles.author}>{post.author.username}</span>
                  <span className={styles.date}>{post.author.email}</span>
                </>
              ) : (
                <span className={styles.author}>작성자 없음</span>
              )}
            </div>

            {/* 파일 목록 표시 */}
            {post.files && post.files.length > 0 && (
              <div className={styles.fileListContainer}>
                <h4>첨부 파일:</h4>
                <ul className={styles.fileList}>
                  {post.files.map((file) => (
                    <li key={file.id} className={styles.fileItem}>
                      <span className={styles.fileName}>{`${file.fileName}`}</span>
                      <button
                        className={styles.downloadButton}
                        onClick={() => handleDownload(file.filePath, file.fileName)}
                      >
                        다운로드
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
