// 'use client'; // 클라이언트 컴포넌트로 선언

// import { usePathname } from 'next/navigation';
// import TopBar from './TopBar';

// export default function ClientLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname(); // 현재 경로 가져오기

//   return (
//     <>
//       {/* 로그인 경로가 아닐 때만 상단바 표시 */}
//       {pathname !== '/login' && <TopBar />}
//       <div>{children}</div> {/* 자식 컴포넌트 렌더링 */}
//     </>
//   );
// }
