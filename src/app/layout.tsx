import type { Metadata, Viewport } from 'next';
import '@/client/index.css';

export const metadata: Metadata = {
  title: 'Vonatinfó',
  icons: { icon: '/mav-g-misi.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
