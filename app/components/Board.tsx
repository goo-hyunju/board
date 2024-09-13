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
      password: string;
      email: string;
      profileImage: string;
      createdAt: string;
    };
    createdAt: string;
    file: File | null |'';
  }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 게시글 리스트를 백엔드에서 불러오는 함수
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data); // 서버에서 가져온 데이터를 상태로 설정
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
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file); // 파일이 있으면 추가
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        body: formData, // FormData 사용
      });
  
      if (response.ok) {
        const savedPost = await response.json();
        console.log('Post saved:', savedPost);
        setPosts([savedPost, ...posts]); // 새로 저장된 게시글을 추가
      } else {
        console.error('게시글을 추가하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };
  
  

  return (
    <div className={styles.boardContainer}>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
        게시글 추가
      </button>

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
            <span className={styles.author}>{post.author.username}</span>
            <span className={styles.date}>{post.author.email}</span>
          </div>
          {post.file && (
            <div className={styles.fileContainer}>
              <span>{post.file.name}</span>
              <button
                className={styles.downloadButton}
                onClick={() => {
                  if (post.file) {
                    const url = URL.createObjectURL(post.file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = post.file.name;
                    a.click();
                    URL.revokeObjectURL(url); 
                  }
                }}
              >
                파일 다운로드
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
