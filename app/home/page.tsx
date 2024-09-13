'use client';

import TopBar from '../components/TopBar';
import Board from '../components/Board';

export default function Home() {
  return (
    <div>
      <TopBar />
      <main style={{ paddingTop: '80px' }}> {/* 상단바 아래에 여백 추가 */}
        <Board />
      </main>
    </div>
  );
}
