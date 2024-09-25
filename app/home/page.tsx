'use client';

import TopBar from '../components/TopBar';
import Board from '../components/Board';

export default function Home() {
  return (
    <div>
      <TopBar isLoggedIn={false} />
      <main style={{ paddingTop: '80px' }}> 
        <Board />
      </main>
    </div>
  );
}
