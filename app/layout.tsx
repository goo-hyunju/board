// RootLayout.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useRouter, usePathname } from 'next/navigation';
import TopBar from './components/TopBar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {pathname !== '/login' && <TopBar />} {/* TopBar는 Redux에서 상태 관리 */}
          <div className="container">{children}</div>
        </Provider>
      </body>
    </html>
  ); 
}
