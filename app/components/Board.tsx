'use client';

import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import Modal from './Modal';

export default function Board() {
  const [posts, setPosts] = useState<{
    id: number;
    title: string;
    content: string;
    authorUsername: string;
    authorEmail: string;
    createdAt: Date;
    files: {
      id: number;
      fileName: string;
      filePath: string;
    }[] | null;
  }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부

  // JWT 토큰을 가져오는 함수
  const getToken = () => localStorage.getItem('token');

  // 게시글 리스트를 백엔드에서 불러오는 함수
  const fetchPosts = async (page: number) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data,"json");

        // data.content가 배열인지 확인 후 처리
        if (Array.isArray(data.content)) {
          setPosts((prevPosts) => [...prevPosts, ...data.content.reverse()]); // 게시물 추가
          setHasMore(!data.last); // 마지막 페이지 여부에 따라 더보기 버튼 상태 설정
        } else {
          console.error('응답 데이터 구조가 예상과 다릅니다. content가 배열이 아닙니다.');
        }
      } else {
        console.error('게시글을 불러오는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 페이지 번호가 변경될 때마다 게시글을 가져오는 useEffect
  useEffect(() => {
    fetchPosts(page); // 페이지 번호가 변경되면 해당 페이지 데이터를 가져옴
  }, [page]);

  // 게시글 추가 함수
  const addPost = async (title: string, content: string, file: File | null) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

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
        setPosts([savedPost, ...posts]); // 새로운 게시글을 기존 posts 배열 앞에 추가
      } else {
        console.error('게시글을 추가하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 게시글 삭제 함수
  const deletePost = async (postId: number) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId)); // 게시글을 삭제하고 배열을 업데이트
      } else {
        console.error('게시글을 삭제하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  // 파일 다운로드 처리 함수
  const handleDownload = (filePath: string, fileName: string) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const downloadUrl = `http://localhost:8080/api/files/download/${fileName}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
  };

  // "더보기" 버튼 클릭 시 다음 페이지 로드
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // 페이지 번호를 1 증가시킴
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
            fetchPosts={() => fetchPosts(0)} // 게시글 추가 후 초기화
          />
        )}

        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <button
              className={styles.deleteButton}
              onClick={() => deletePost(post.id)}
            >
              삭제
            </button>
            <h2 className={styles.title}>{post.title}</h2>
            <p className={styles.content}>{post.content}</p>
            <div className={styles.postFooter}>
              <span className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString()} {/* 작성 날짜 표시 */}
              </span>
            </div>
            <div className={styles.postFooter}>
              <span className={styles.author}>{post.authorUsername}</span>
              <span className={styles.email}>{post.authorEmail}</span>
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            더보기
          </button>
        </div>
      )}
    </>
  );
}
