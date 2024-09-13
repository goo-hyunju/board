import TopBar from './components/TopBar';
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'A simple login app with multiple pages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
