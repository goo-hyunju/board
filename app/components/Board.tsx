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
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return null;
    }
    return token;
  };

  // 게시글 리스트를 백엔드에서 불러오는 함수 (페이지네이션 적용, 새로 가져올 때 기존 게시글 덮어쓰기)
  const fetchPosts = async (page: number) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`http://172.16.30.182:40001/api/posts?page=${page}&size=1`, { // 1개씩 가져오기
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data, 'json');

        // data.content가 배열인지 확인 후 처리 (기존 게시글 덮어쓰기)
        if (Array.isArray(data.content)) {
          setPosts(data.content.reverse()); // 게시글을 역순으로 보여주고 하나씩만 표시
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

  // 게시글 추가 함수 (다중 파일 업로드 지원)
  const addPost = async (title: string, content: string, files: File[]) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 다중 파일을 FormData에 추가
    files.forEach((file) => {
      formData.append('files', file); // 여러 파일을 'files'라는 키로 추가
    });

    try {
      const response = await fetch('http://172.16.30.182:40001/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
        body: formData,
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts([savedPost]); // 새로운 게시글을 기존 posts 배열 앞에 추가 (하나만 보여줌)
        setIsModalOpen(false);  // 모달 닫기
      } else {
        console.error('게시글을 추가하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };
  const handleDownload = async (fileId: number) => {
    const token = getToken();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const response = await fetch(`http://172.16.30.182:40001/api/files/download/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file_name'; // 실제 파일 이름으로 변경
      a.click();
    } else {
      console.error('파일 다운로드 중 오류 발생');
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
      const response = await fetch(`http://172.16.30.182:40001/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
      });

      if (response.ok) {
        setPosts([]); // 삭제 후 게시글 목록을 초기화하여 한 개만 남기도록 처리
      } else {
        console.error('게시글을 삭제하는 중 오류 발생:', response.statusText);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
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
            onSave={addPost} // 다중 파일을 처리할 수 있도록 수정된 addPost 함수
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
                          onClick={() => handleDownload(file.id)} 
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
